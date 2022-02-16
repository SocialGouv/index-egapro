import { Span } from "@/components/Span"
import { SinglePageLayout } from "@/components/ds/SinglePageLayout"
import { ReactElement } from "react"

export default function HomePage() {
  return <Span name="Marty"></Span>
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <SinglePageLayout>{page}</SinglePageLayout>
}
