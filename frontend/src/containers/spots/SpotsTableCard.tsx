import { MdAdd } from "react-icons/md";
import Heading from "../../components/ui/Heading";
import { Button } from "../../components/ui/Button";
import { useState } from "react";
import useSpotsData from "../../hooks/spots/useSpotsData";
import SpotsTable from "./SpotsTable";
import SpotFormDialog from "./SpotFormDialog";

export default function SpotsTableCard() {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    data,
    refreshData,
    onDelete,
    loading,
    spotToUpdate,
    setSpotToUpdate,
    pagination
  } = useSpotsData();
  return (
    <div className="border rounded-md p-6 space-y-6 flex-1 mr-8">
      <div className="flex">
        <Heading size="xs" asChild>
          <h3>Vagas</h3>
        </Heading>
        <Button className="ml-auto h-8" onClick={() => setModalOpen(true)}>
          <MdAdd className="h-6 w-6" />
          Criar vaga
        </Button>
      </div>
      <SpotsTable
        data={data}
        pagination={pagination}
        loading={loading}
        onDelete={onDelete}
        onUpdate={setSpotToUpdate}
      />
      <SpotFormDialog
        open={modalOpen || !!spotToUpdate}
        id={spotToUpdate?.id}
        initialData={spotToUpdate
          ? {
            code: spotToUpdate.code,
            floor: spotToUpdate.floor,
            spot_type_id: String(spotToUpdate.spotType.id)
          }
          : undefined}
        onSuccess={() => refreshData()}
        onOpenChange={() => {
          setModalOpen(false);
          setSpotToUpdate(null);
        }}
      />
    </div>
  );
}
