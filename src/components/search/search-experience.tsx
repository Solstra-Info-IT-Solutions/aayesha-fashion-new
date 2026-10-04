"use client";

import { ListingSalesBar } from "@/components/listing-sales/listing-sales-bar";
import { ShopByNeed } from "@/components/home-sales/shop-by-need";
import { ProductStrip } from "@/components/orders-sales/product-strip";
import { RecentlyViewed } from "@/components/recently-viewed/recently-viewed";
import {
  SearchHelpCta,
  SearchRefineBar,
  useRefinedResults,
} from "@/components/search/search-sales";
import { trackSearch } from "@/lib/analytics";
import { ProductInsightsProvider } from "@/components/listing-sales/insights-context";
import Image from "next/image";
import Link from "next/link";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowUpRight,
  Clock3,
  Search,
  X,
} from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import { useIsClient } from "@/hooks/use-is-client";
import { getProducts } from "@/lib/api/products";
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  removeRecentSearch,
} from "@/lib/recent-searches/recent-searches";
import {
  popularSearches,
  searchCategories,
  searchSiteEntries,
} from "@/lib/search/site-index";
import { getCategories } from "@/services/category.service";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

import "./SearchExperience.css";
import "./SearchAtelier.css";

/* =========================================================
   TYPES
========================================================= */

interface SearchExperienceProps {
  initialQuery: string;
  initialProducts: Product[];
  initialTotal: number;
  initialCategories: Category[];
}

type ResultState = {
  term: string;
  products: Product[];
  total: number;
  failed: boolean;
};

type Filter = "all" | "pieces" | "collections" | "pages";

const PRODUCT_LIMIT = 24;

/* =========================================================
   HIGHLIGHT
========================================================= */

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({
  text,
  term,
}: {
  text: string;
  term: string;
}): ReactNode {
  const words = term
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map(escapeRegExp);

  if (words.length === 0) {
    return text;
  }

  const parts = text.split(
    new RegExp(`(${words.join("|")})`, "gi"),
  );

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark key={index} className="search-atelier__mark">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export function SearchExperience({
  initialQuery,
  initialProducts,
  initialTotal,
  initialCategories,
}: SearchExperienceProps) {
  const isClient = useIsClient();

  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState(initialQuery);
  const [term, setTerm] = useState(initialQuery.trim());
  const [filter, setFilter] = useState<Filter>("all");

  const [recents, setRecents] = useState<string[]>(() =>
    getRecentSearches(),
  );

  const [categories, setCategories] =
    useState<Category[]>(initialCategories);

  const [result, setResult] = useState<ResultState>({
    term: initialQuery.trim(),
    products: initialProducts,
    total: initialTotal,
    failed: false,
  });

  /* ---------------------------------------------------------
     The search term that is currently in effect. Clearing the
     field clears the results immediately; typing waits for the
     debounce below.
  --------------------------------------------------------- */

  const activeTerm = input.trim() === "" ? "" : term;

  /* =======================================================
     DEBOUNCE + URL SYNC
  ======================================================= */

  useEffect(() => {
    const trimmed = input.trim();

    const timer = window.setTimeout(() => {
      setTerm(trimmed);

      window.history.replaceState(
        null,
        "",
        trimmed
          ? `/search?q=${encodeURIComponent(trimmed)}`
          : "/search",
      );
    }, 320);

    return () => window.clearTimeout(timer);
  }, [input]);

  /* =======================================================
     LOAD PRODUCTS
  ======================================================= */

  useEffect(() => {
    if (!activeTerm || result.term === activeTerm) {
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const response = await getProducts({
          page: 1,
          limit: PRODUCT_LIMIT,
          search: activeTerm,
          status: "active",
          sort: "relevance",
        });

        if (!cancelled) {
          trackSearch(activeTerm);

          setResult({
            term: activeTerm,
            products: response.products,
            total:
              response.pagination?.total ??
              response.products.length,
            failed: false,
          });
        }
      } catch {
        if (!cancelled) {
          setResult({
            term: activeTerm,
            products: [],
            total: 0,
            failed: true,
          });
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [activeTerm, result.term]);

  /* =======================================================
     LOAD CATEGORIES (only if the server could not)
  ======================================================= */

  useEffect(() => {
    if (initialCategories.length > 0) {
      return;
    }

    let cancelled = false;

    getCategories()
      .then((data) => {
        if (!cancelled) {
          setCategories(data.filter((item) => item.isActive));
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [initialCategories.length]);

  /* =======================================================
     SAVE THE SEARCH THAT ARRIVED IN THE URL
  ======================================================= */

  useEffect(() => {
    if (initialQuery.trim()) {
      addRecentSearch(initialQuery.trim());
    }
  }, [initialQuery]);

  /* =======================================================
     "/" FOCUSES THE FIELD
  ======================================================= */

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (event.key === "/" && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () =>
      document.removeEventListener("keydown", onKeyDown);
  }, []);

  /* =======================================================
     ACTIONS
  ======================================================= */

  const remember = (query: string) => {
    addRecentSearch(query);
    setRecents(getRecentSearches());
  };

  const runSearch = (query: string) => {
    const trimmed = query.trim();

    setInput(query);
    setFilter("all");

    if (trimmed) {
      setTerm(trimmed);
      remember(trimmed);
    }

    inputRef.current?.focus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = input.trim();

    if (trimmed) {
      setTerm(trimmed);
      remember(trimmed);
    }
  };

  const clearInput = () => {
    setInput("");
    setTerm("");
    setFilter("all");
    setRecents(getRecentSearches());
    inputRef.current?.focus();
  };

  const removeRecent = (query: string) => {
    removeRecentSearch(query);
    setRecents(getRecentSearches());
  };

  const clearRecents = () => {
    clearRecentSearches();
    setRecents([]);
  };

  /* =======================================================
     DERIVED RESULTS
  ======================================================= */

  const hasTerm = activeTerm !== "";

  const loading = hasTerm && result.term !== activeTerm;

  const products = hasTerm && !loading ? result.products : [];

  const refine = useRefinedResults(products);

  const siteMatches = useMemo(
    () => (hasTerm ? searchSiteEntries(activeTerm) : []),
    [hasTerm, activeTerm],
  );

  const categoryMatches = useMemo(
    () =>
      hasTerm ? searchCategories(categories, activeTerm) : [],
    [hasTerm, activeTerm, categories],
  );

  const collectionMatches = [
    ...categoryMatches.map((category) => ({
      key: `category-${category.id}`,
      title: category.name,
      description:
        category.description ||
        `Shop ${category.name} from Aayesha Fashion.`,
      href: `/categories?category=${category.id}`,
      image: category.image,
    })),
    ...siteMatches
      .filter((entry) => entry.type === "collection")
      .map((entry) => ({
        key: entry.href,
        title: entry.title,
        description: entry.description,
        href: entry.href,
        image: "",
      })),
  ];

  const pageMatches = siteMatches.filter(
    (entry) => entry.type === "page",
  );

  const counts = {
    pieces: loading ? null : result.total,
    collections: collectionMatches.length,
    pages: pageMatches.length,
  };

  const nothingFound =
    hasTerm &&
    !loading &&
    products.length === 0 &&
    collectionMatches.length === 0 &&
    pageMatches.length === 0;

  const show = (section: Exclude<Filter, "all">) =>
    filter === "all" || filter === section;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="search-atelier">
      {/* =====================================================
          FIELD
      ===================================================== */}

      <section
        className={
          hasTerm
            ? "search-atelier__hero search-atelier__hero--compact"
            : "search-atelier__hero"
        }
      >
        <div className="search-atelier__art" aria-hidden="true">
          <Image
            src="/images/home/featured-collection-campaign.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 900px) 100vw, 55vw"
            className="search-atelier__art-image"
          />
        </div>

        <div className="search-atelier__inner">
          <div className="search-atelier__eyebrow">
            <span aria-hidden="true" />
            Search Aayesha
          </div>

          <h1 className="search-atelier__title">
            What are you{" "}
            <em>looking for?</em>
          </h1>

          <form
            role="search"
            onSubmit={handleSubmit}
            className="search-atelier__form"
          >
            <Search
              size={22}
              strokeWidth={1.5}
              aria-hidden="true"
              className="search-atelier__form-icon"
            />

            <input
              ref={inputRef}
              type="search"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Escape" && input) {
                  event.preventDefault();
                  clearInput();
                }
              }}
              placeholder="Search pieces, help, more…"
              aria-label="Search the Aayesha website"
              autoComplete="off"
              enterKeyHint="search"
              className="search-atelier__input"
            />

            {input && (
              <button
                type="button"
                onClick={clearInput}
                aria-label="Clear search"
                className="search-atelier__clear"
              >
                <X size={18} strokeWidth={1.6} />
              </button>
            )}

            <button
              type="submit"
              aria-label="Search"
              className="search-atelier__submit"
            >
              <span className="search-atelier__submit-label">
                Search
              </span>

              <Search
                size={20}
                strokeWidth={1.7}
                aria-hidden="true"
                className="search-atelier__submit-icon"
              />
            </button>
          </form>

          <p className="search-atelier__hint">
            {hasTerm ? (
              loading ? (
                <>Searching for “{activeTerm}”…</>
              ) : (
                <>
                  Showing results for{" "}
                  <strong>“{activeTerm}”</strong>
                </>
              )
            ) : (
              <span className="search-atelier__shortcuts">
                Press <kbd>/</kbd> to search from anywhere on
                this page, <kbd>Esc</kbd> to clear.
              </span>
            )}
          </p>

          {!hasTerm && (
            <div className="search-atelier__trending">
              <span>Trending</span>

              {popularSearches.slice(0, 5).map((query) => (
                <button
                  key={query}
                  type="button"
                  onClick={() => runSearch(query)}
                >
                  {query}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {!hasTerm && (
        <section
          className="search-atelier__inner search-atelier__showcase"
          aria-labelledby="search-showcase-title"
        >
          <header className="search-atelier__showcase-head">
            <p>The edit</p>

            <h2 id="search-showcase-title">
              Begin with a <em>collection</em>
            </h2>
          </header>

          <ul className="search-atelier__showcase-grid">
            {[
              {
                label: "New Arrivals",
                note: "Just introduced",
                href: "/collections/new-arrivals",
                image: "/images/choose/new-arrivals.jpg",
              },
              {
                label: "Best Sellers",
                note: "Most loved",
                href: "/collections/best-sellers",
                image: "/images/choose/best-sellers.jpg",
              },
              {
                label: "Festive Edit",
                note: "For celebrations",
                href: "/collections/festive",
                image: "/images/choose/festive.jpg",
              },
            ].map((item, index) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="search-atelier__showcase-card"
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 100vw, 33vw"
                    className="search-atelier__showcase-image"
                  />

                  <span className="search-atelier__showcase-shade" aria-hidden="true" />

                  <span className="search-atelier__showcase-index">
                    0{index + 1}
                  </span>

                  <span className="search-atelier__showcase-copy">
                    <small>{item.note}</small>
                    <strong>{item.label}</strong>

                    <span className="search-atelier__showcase-cta">
                      Explore
                      <ArrowUpRight
                        size={14}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="search-atelier__inner search-atelier__body">
        {/* =====================================================
            NOTHING TYPED — RECENT, POPULAR, BROWSE
        ===================================================== */}

        {!hasTerm && (
          <div className="search-atelier__start">
            <div className="search-atelier__start-col">
              {isClient && recents.length > 0 && (
                <section
                  aria-labelledby="search-recents-title"
                  className="search-atelier__block"
                >
                  <header className="search-atelier__block-head">
                    <h2 id="search-recents-title">
                      <Clock3
                        size={15}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      Recent searches
                    </h2>

                    <button
                      type="button"
                      onClick={clearRecents}
                      className="search-atelier__text-button"
                    >
                      Clear all
                    </button>
                  </header>

                  <ul className="search-atelier__recents">
                    {recents.map((query) => (
                      <li key={query}>
                        <button
                          type="button"
                          onClick={() => runSearch(query)}
                          className="search-atelier__recent"
                        >
                          <Search
                            size={14}
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          <span>{query}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeRecent(query)}
                          aria-label={`Remove ${query} from recent searches`}
                          className="search-atelier__recent-remove"
                        >
                          <X size={14} strokeWidth={1.5} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section
                aria-labelledby="search-popular-title"
                className="search-atelier__block"
              >
                <header className="search-atelier__block-head">
                  <h2 id="search-popular-title">
                    Popular right now
                  </h2>
                </header>

                <div className="search-atelier__chips">
                  {popularSearches.map((query) => (
                    <button
                      key={query}
                      type="button"
                      onClick={() => runSearch(query)}
                      className="search-atelier__chip"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </section>

              <section
                aria-labelledby="search-help-title"
                className="search-atelier__block"
              >
                <header className="search-atelier__block-head">
                  <h2 id="search-help-title">
                    Quick links
                  </h2>
                </header>

                <ul className="search-atelier__links">
                  {[
                    ["Track an order", "/account/orders"],
                    ["Shipping & delivery", "/shipping"],
                    ["Returns & exchange", "/returns"],
                    ["Contact us", "/contact"],
                  ].map(([label, href]) => (
                    <li key={href}>
                      <Link href={href}>
                        {label}
                        <ArrowUpRight
                          size={14}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section
              aria-labelledby="search-browse-title"
              className="search-atelier__block search-atelier__browse"
            >
              <header className="search-atelier__block-head">
                <h2 id="search-browse-title">
                  Browse by category
                </h2>

                <Link
                  href="/categories"
                  className="search-atelier__text-button"
                >
                  View all
                </Link>
              </header>

              {categories.length > 0 ? (
                <ul className="search-atelier__tiles">
                  {categories.slice(0, 6).map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/categories?category=${category.id}`}
                        className="search-atelier__tile"
                      >
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt=""
                            fill
                            sizes="(max-width: 767px) 50vw, 20vw"
                            className="search-atelier__tile-image"
                          />
                        ) : null}

                        <span className="search-atelier__tile-name">
                          {category.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="search-atelier__muted">
                  Explore everything in the{" "}
                  <Link href="/shop">shop</Link>.
                </p>
              )}
            </section>
          </div>
        )}

        {!hasTerm && (
          <>
            <ListingSalesBar />

            <ProductStrip
              eyebrow="Start with the best"
              title="Customer favourites"
            />

            <ShopByNeed />

            <RecentlyViewed
              title="Pick up where you left off"
              eyebrow="Recently viewed"
              limit={4}
            />

            <SearchHelpCta term="" />
          </>
        )}

        {/* =====================================================
            RESULTS
        ===================================================== */}

        {hasTerm && (
          <div aria-live="polite">
            {/* Filters */}

            <div
              role="group"
              aria-label="Filter results"
              className="search-atelier__filters"
            >
              {(
                [
                  ["all", "All", null],
                  ["pieces", "Pieces", counts.pieces],
                  ["collections", "Collections", counts.collections],
                  ["pages", "Help & pages", counts.pages],
                ] as [Filter, string, number | null][]
              ).map(([key, label, count]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={filter === key}
                  onClick={() => setFilter(key)}
                  className="search-atelier__filter"
                >
                  {label}
                  {count !== null && (
                    <span>{count}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Collections */}

            {show("collections") &&
              collectionMatches.length > 0 && (
                <section className="search-atelier__group">
                  <header className="search-atelier__group-head">
                    <span>01</span>
                    <h2>Collections</h2>
                  </header>

                  <ul className="search-atelier__cards">
                    {collectionMatches.map((item) => (
                      <li key={item.key}>
                        <Link
                          href={item.href}
                          onClick={() => remember(activeTerm)}
                          className="search-atelier__card"
                        >
                          {item.image ? (
                            <span className="search-atelier__card-media">
                              <Image
                                src={item.image}
                                alt=""
                                fill
                                sizes="72px"
                              />
                            </span>
                          ) : null}

                          <span className="search-atelier__card-copy">
                            <strong>
                              <Highlight
                                text={item.title}
                                term={activeTerm}
                              />
                            </strong>
                            <span>{item.description}</span>
                          </span>

                          <ArrowUpRight
                            size={16}
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            {/* Pieces */}

            {show("pieces") && (
              <section className="search-atelier__group">
                <header className="search-atelier__group-head">
                  <span>02</span>
                  <h2>Pieces</h2>

                  {!loading && result.total > 0 && (
                    <Link
                      href={`/shop?search=${encodeURIComponent(
                        activeTerm,
                      )}`}
                      className="search-atelier__text-button"
                    >
                      {result.total > products.length
                        ? `View all ${result.total} in shop`
                        : "Open in shop"}
                    </Link>
                  )}
                </header>

                {loading && (
                  <div
                    className="search-atelier__grid"
                    aria-hidden="true"
                  >
                    {Array.from({ length: 4 }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className="search-atelier__skeleton"
                        />
                      ),
                    )}
                  </div>
                )}

                {!loading && products.length > 0 && (
                  <>
                    <ListingSalesBar />

                    <SearchRefineBar
                      active={refine.active}
                      toggle={refine.toggle}
                      sort={refine.sort}
                      setSort={refine.setSort}
                      shown={refine.refined.length}
                      total={products.length}
                    />

                    {refine.refined.length === 0 ? (
                      <p className="search-atelier__muted">
                        No pieces match these filters. Try removing one.
                      </p>
                    ) : (
                      <ProductInsightsProvider
                        productIds={products.map((product) => product._id)}
                      >
                        <div
                          className="search-atelier__grid"
                          onClickCapture={() => remember(activeTerm)}
                        >
                          {refine.refined.map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                            />
                          ))}
                        </div>
                      </ProductInsightsProvider>
                    )}
                  </>
                )}

                {!loading &&
                  products.length === 0 &&
                  !nothingFound && (
                    <p className="search-atelier__muted">
                      {result.failed
                        ? "We could not load pieces right now. Please try again."
                        : `No pieces match “${activeTerm}” — but these might help.`}
                    </p>
                  )}
              </section>
            )}

            {/* Pages */}

            {show("pages") && pageMatches.length > 0 && (
              <section className="search-atelier__group">
                <header className="search-atelier__group-head">
                  <span>03</span>
                  <h2>Help &amp; pages</h2>
                </header>

                <ul className="search-atelier__cards">
                  {pageMatches.map((entry) => (
                    <li key={entry.href}>
                      <Link
                        href={entry.href}
                        onClick={() => remember(activeTerm)}
                        className="search-atelier__card"
                      >
                        <span className="search-atelier__card-copy">
                          <strong>
                            <Highlight
                              text={entry.title}
                              term={activeTerm}
                            />
                          </strong>
                          <span>{entry.description}</span>
                        </span>

                        <ArrowUpRight
                          size={16}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Nothing at all */}

            {nothingFound && (
              <section className="search-atelier__none">
                <p className="search-atelier__none-eyebrow">
                  No matches
                </p>

                <h2>
                  Nothing found for “{activeTerm}”
                </h2>

                <p>
                  Check the spelling, try a shorter word, or
                  start from one of these.
                </p>

                <div className="search-atelier__chips">
                  {popularSearches.slice(0, 6).map((query) => (
                    <button
                      key={query}
                      type="button"
                      onClick={() => runSearch(query)}
                      className="search-atelier__chip"
                    >
                      {query}
                    </button>
                  ))}
                </div>

                <Link href="/shop" className="search-atelier__cta">
                  Browse the full collection
                </Link>
              </section>
            )}

            {/* Always offer help, and fresh ideas when results are thin */}

            {!loading && (nothingFound || products.length < 4) ? (
              <>
                <SearchHelpCta term={activeTerm} />

                <ProductStrip
                  eyebrow="You may also like"
                  title="Customer favourites"
                  excludeIds={products.map((product) => product._id)}
                />
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
