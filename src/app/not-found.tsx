import { StatusPage } from "@/components/common/status-page";
import { LinkButton } from "@/components/ui/button";

/*
 * Root 404 for URLs that match no route. Pages inside the store
 * group use (store)/not-found.tsx, which keeps the header/footer.
 */
export default function NotFound() {
  return (
    <StatusPage
      eyebrow="Error 404"
      title="This page could not be found."
      description="The link may be out of date, or the piece you are looking for is no longer available."
    >
      <LinkButton href="/" size="lg">
        Back to home
      </LinkButton>
    </StatusPage>
  );
}
