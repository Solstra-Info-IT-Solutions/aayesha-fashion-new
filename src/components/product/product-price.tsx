import type { Product } from "@/types/product";

interface ProductPriceProps {
  product: Product;
}

export function ProductPrice({
  product,
}: ProductPriceProps) {
  const { mrp, sellingPrice } = product.pricing;

  const discount =
    mrp > sellingPrice
      ? Math.round(
          ((mrp - sellingPrice) / mrp) * 100,
        )
      : 0;

  return (
    <div className="product-price">
      {/* =====================================================
          PRICE ROW
      ===================================================== */}

      <div className="product-price__row">
        {/* SELLING PRICE */}

        <span className="product-price__selling">
          ₹{sellingPrice.toLocaleString("en-IN")}
        </span>

        {/* MRP */}

        {mrp > sellingPrice && (
          <span className="product-price__mrp">
            ₹{mrp.toLocaleString("en-IN")}
          </span>
        )}

        {/* DISCOUNT */}

        {discount > 0 && (
          <span className="product-price__discount">
            {discount}% off
          </span>
        )}
      </div>

      {/* =====================================================
          TAX NOTE
      ===================================================== */}

      <p className="product-price__tax">
        Inclusive of applicable taxes
      </p>
    </div>
  );
}