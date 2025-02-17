import React, { useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailSale, getSales } from '../../slices/thunk';
import Loader from '../../common/Loader';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';

const Sale = () => {
  const navigate: any = useNavigate();
  const dispatch: any = useDispatch();
  const [saleDetailModal, setSaleDetailModal] = useState(false);
  const dt = useRef<DataTable<any[]>>(null);
  const sales = useSelector((state: any) => state.Sales.salesList);
  const loading = useSelector((state: any) => state.Sales.loading);
  const detailSale = useSelector((state: any) => state.Sales.detailSale);

  console.log('Deta', detailSale);
  useEffect(() => {
    dispatch(getSales());
  }, []);

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          className="p-2 bg-blue-800 text-white"
          label="Crear venta"
          icon="pi pi-plus"
          severity="success"
          onClick={() => navigate('/sales/create')}
        />
      </div>
    );
  };

  const openModalDetail = (sale: any) => {
    setSaleDetailModal(true);
    const { id } = sale;
    if (id) {
      dispatch(getDetailSale(id));
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
  return (
    <React.Fragment>
      <Breadcrumb pageName="Ventas" />
      <Toolbar className="mb-4" start={leftToolbarTemplate} />

      {loading ? (
        <Loader />
      ) : (
        <DataTable ref={dt} value={sales} paginator rows={10}>
          <Column
            field="date"
            header="Fecha"
            sortable
            style={{ minWidth: '7rem' }}
          ></Column>
          <Column
            field="notes"
            header="Nota"
            sortable
            style={{ minWidth: '12rem' }}
          ></Column>

          <Column
            field="subtotal"
            header="Subtotal"
            body={(rowData) => `$${rowData.subtotal}`}
            sortable
            style={{ minWidth: '5rem' }}
          ></Column>

          <Column
            field="tax"
            header="Impuesto"
            sortable
            style={{ minWidth: '5rem' }}
          ></Column>

          <Column
            field="total"
            header="Total"
            body={(rowData) => `$${rowData.total}`}
            sortable
            style={{ minWidth: '5rem' }}
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
        visible={saleDetailModal}
        style={{ width: '40vw' }}
        header="Detalle de venta"
        modal
        onHide={() => setSaleDetailModal(false)}
      >
        <DataTable value={detailSale} size="large">
          <Column field="product.name" header="Producto"></Column>
          <Column field="quantity" header="Cantidad"></Column>
          <Column
            field="unitCost"
            header="Precio"
            body={(rowData) => `$${rowData.unitCost.toFixed(2)}`}
          ></Column>
          <Column
            field="subtotal"
            header="Total"
            body={(rowData) => `$${rowData.subtotal.toFixed(2)}`}
          ></Column>
        </DataTable>
      </Dialog>
    </React.Fragment>
  );
};

export default Sale;
