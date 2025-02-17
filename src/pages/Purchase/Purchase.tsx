import React, { useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { getPurchase, getPurchaseDetails } from '../../slices/thunk';
import Loader from '../../common/Loader';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';

const Purchase = () => {
  const dispatch: any = useDispatch();

  const purchases = useSelector((state: any) => state.Purchases.purchaseList);
  const loading = useSelector((state: any) => state.Purchases.loading);
  const purchaseDetail = useSelector(
    (state: any) => state.Purchases?.purchaseDetails,
  );
  const dt = useRef<DataTable<any[]>>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const navigate: any = useNavigate();
  const [detailPurchase, setDetailPurchase] = useState([]);

  console.log('Purchase detail', purchaseDetail);

  useEffect(() => {
    dispatch(getPurchase());
  }, []);

  const openModalDetail = (data: any) => {
    setOpenModal(true);
    const { id } = data;
    if (id) {
      dispatch(getPurchaseDetails(id));
      setDetailPurchase(purchaseDetail);
    }
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-eye"
          className=""
          onClick={() => openModalDetail(rowData)}
        />
        <Button
          className="text-red"
          icon="pi pi-trash"
          severity="danger"
          onClick={() => {}}
        />
      </React.Fragment>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          className="p-2 bg-blue-800 text-white"
          label="Crear compra"
          icon="pi pi-plus"
          severity="success"
          onClick={() => navigate('/purchases/create')}
        />
      </div>
    );
  };

  return (
    <React.Fragment>
      <Breadcrumb pageName="Compras" />
      <Toolbar className="mb-4" start={leftToolbarTemplate} />

      {loading ? (
        <Loader />
      ) : (
        <DataTable ref={dt} value={purchases} paginator rows={10}>
          <Column
            field="date"
            header="Fecha"
            sortable
            style={{ minWidth: '12rem' }}
          ></Column>
          <Column
            field="notes"
            header="Notas"
            sortable
            style={{ minWidth: '12rem' }}
          ></Column>

          <Column
            field="subtotal"
            header="Subtotal"
            sortable
             body={(rowData) => `$${rowData.subtotal}`}
            style={{ minWidth: '6' }}
          ></Column>

          <Column
            field="tax"
            header="Impuesto"
            sortable
            style={{ minWidth: '6' }}
          ></Column>
          <Column
            field="total"
            header="Total"
              body={(rowData) => `$${rowData.total}`}
            sortable
            style={{ minWidth: '6rem' }}
          ></Column>

          <Column
            header="Acciones"
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: '12rem' }}
          ></Column>
        </DataTable>
      )}

      <Dialog
        visible={openModal}
        header="Detalle de compra"
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        style={{ width: '35rem' }}
        modal
        className=""
        onHide={() => setOpenModal(false)}
      >
        <DataTable
          value={purchaseDetail}
          className="border border-1"
          size="small"
        >
          <Column field="product.name" header="Producto"></Column>
          <Column field="quantity" header="Cantidad"></Column>
          <Column
            field="price"
            header="Precio"
            body={(rowData) => `$${rowData.price.toFixed(2)}`}
          ></Column>
          <Column
            field="total"
            header="Total"
            body={(rowData) => `$${rowData.total.toFixed(2)}`}
          ></Column>
        </DataTable>
      </Dialog>
    </React.Fragment>
  );
};

export default Purchase;
