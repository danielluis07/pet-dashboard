import { EditProductClient } from "./_components/edit-product-client";

const ProcuctPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  return <EditProductClient id={id} />;
};

export default ProcuctPage;
