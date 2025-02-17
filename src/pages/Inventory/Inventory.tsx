import React, { useEffect, useRef } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { getInventory } from '../../slices/thunk';
import { Toolbar } from 'primereact/toolbar';
import Loader from '../../common/Loader';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const Inventory = () => {
  const dispatch: any = useDispatch();
  const dt = useRef<DataTable<any[]>>(null);

  const inventories = useSelector(
    (state: any) => state.Inventories.inventoryList,
  );
  const loading = useSelector((state: any) => state.Inventories.loading);

  useEffect(() => {
    dispatch(getInventory());
  }, []);

  const statusProduct = (e: any) => {
    return (
      <React.Fragment>
        {e.stock <= 4 ? <p>Bajo stock</p> : <p>Disponible</p>}
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <Breadcrumb pageName="Inventario" />

      <Toolbar
        className="mb-4"
        start={() => <React.Fragment>Inventario general</React.Fragment>}
      />

      {loading ? (
        <Loader />
      ) : (
        <DataTable ref={dt} value={inventories} paginator rows={5}>
          <Column
            field="product.name"
            header="Producto"
            sortable
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="product.code"
            header="Codigo"
            sortable
            style={{ minWidth: '12rem' }}
          />

          <Column
            field="product.price"
            header="Precio"
            sortable
            style={{ minWidth: '12rem' }}
          />

          <Column
            field="stock"
            header="Stock"
            sortable
            style={{ minWidth: '12rem' }}
          />

          <Column header="Estado" body={statusProduct} />
        </DataTable>
      )}
    </React.Fragment>
  );
};

export default Inventory;
