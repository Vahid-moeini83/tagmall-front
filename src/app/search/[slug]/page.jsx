import SearchResults from "@/components/modules/search-results";

export default function SearchPage({ params }) {
  return <SearchResults slug={params.slug} />;
}
