import { Banknote, RotateCcw, ShieldCheck } from "lucide-react";

import "./CommerceSales.css";

/** Reassurance shown next to the main checkout actions. */
export function TrustRow() {
  return (
    <ul className="commerce-trust">
      <li>
        <ShieldCheck size={15} strokeWidth={1.5} />
        Secure payments
      </li>

      <li>
        <Banknote size={15} strokeWidth={1.5} />
        UPI / bank transfer
      </li>

      <li>
        <RotateCcw size={15} strokeWidth={1.5} />
        Easy returns
      </li>
    </ul>
  );
}
