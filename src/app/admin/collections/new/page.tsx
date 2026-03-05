import { CollectionForm } from "@/components/admin/collection-form";

export default function NewCollectionPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Collection</h1>
      <CollectionForm />
    </div>
  );
}
