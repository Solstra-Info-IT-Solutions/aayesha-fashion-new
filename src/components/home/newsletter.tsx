"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

import { Container } from "@/components/shared/container";
import type { HomepageNewsletter } from "@/types/homepage";

interface NewsletterProps {
  data: HomepageNewsletter;
}

export function Newsletter({
  data,
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    setSubmitted(true);
    setEmail("");
  }

  return (
    <section id="newsletter" className="newsletter">
      <Container>
        <div className="newsletter__inner">
          {/* =====================================================
              INTRO
          ===================================================== */}

          <div className="newsletter__intro">
            <div className="newsletter__eyebrow">
              <span
                aria-hidden="true"
                className="newsletter__eyebrow-line"
              />

              <span className="newsletter__eyebrow-text">
                Private Edit
              </span>

              <span
                aria-hidden="true"
                className="newsletter__eyebrow-line"
              />
            </div>

            <h2 className="newsletter__title">
              {data.title.lineOne}{" "}
              <span className="newsletter__title-accent">
                {data.title.lineTwo}
              </span>
            </h2>

            <p className="newsletter__description">
              {data.description}
            </p>
          </div>

          {/* =====================================================
              FORM
          ===================================================== */}

          <div className="newsletter__form-wrapper">
            {submitted ? (
              <div className="newsletter__success">
                <span
                  aria-hidden="true"
                  className="newsletter__success-icon"
                >
                  <Check
                    size={16}
                    strokeWidth={1.6}
                  />
                </span>

                <div className="newsletter__success-content">
                  <p className="newsletter__success-title">
                    Welcome to the Private Edit.
                  </p>

                  <p className="newsletter__success-description">
                    You&apos;re now part of Ayesha Fashion.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <form
                  onSubmit={handleSubmit}
                  className="newsletter__form"
                >
                  {/* EMAIL */}
                  <div className="newsletter__field">
                    <label
                      htmlFor="newsletter-email"
                      className="newsletter__label"
                    >
                      Email Address
                    </label>

                    <input
                      id="newsletter-email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder={data.inputPlaceholder}
                      autoComplete="email"
                      required
                      className="newsletter__input"
                    />
                  </div>

                  {/* BUTTON */}
                  <button
                    type="submit"
                    className="newsletter__button"
                  >
                    <span>{data.buttonLabel}</span>

                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.4}
                      aria-hidden="true"
                      className="newsletter__button-icon"
                    />
                  </button>
                </form>

                <p className="newsletter__disclaimer">
                  {data.disclaimer}
                </p>
              </>
            )}
          </div>

          {/* =====================================================
              BRAND SIGN-OFF
          ===================================================== */}

          <div className="newsletter__signoff">
            <span className="newsletter__signoff-label">
              Ayesha Fashion
            </span>

            <span className="newsletter__signoff-name">
              Ayesha
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}