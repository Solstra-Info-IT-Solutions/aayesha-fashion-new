import { StatusPage } from "@/components/common/status-page";
import { LinkButton } from "@/components/ui/button";

export default function StoreNotFound() {
  return (
    <StatusPage
      eyebrow="Error 404"
      title="This page could not be found."
      description="The link may be out of date, or the piece you are looking for is no longer available."
    >
      <LinkButton href="/shop" size="lg">
        Continue shopping
      </LinkButton>

      <LinkButton
        href="/"
        variant="secondary"
        size="lg"
      >
        Back to home
      </LinkButton>
    </StatusPage>
  );
}
