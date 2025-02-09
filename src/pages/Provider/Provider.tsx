import React, { useEffect, useRef } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { getProviders } from '../../slices/thunk';
import Loader from '../../common/Loader';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
const Provider = () => {
  const dispatch: any = useDispatch();
  const dt = useRef<DataTable<any[]>>(null);
  const providers = useSelector((state: any) => state.Providers.providerList);
  const loading = useSelector((state: any) => state.Providers.loading);
  console.log('PRoveedores', providers);

  useEffect(() => {
    dispatch(getProviders());
  }, []);

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="" onClick={() => {}} />
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
            label="Crear proveedor"
            icon="pi pi-plus"
            severity="success"
            onClick={()=>{}}
          />
        </div>
      );
    };
  
  return (
    <React.Fragment>
      <Breadcrumb pageName="Proveedores" />

       <Toolbar
                className="mb-4"
                start={leftToolbarTemplate}
               
              />

      {loading ? (
        <Loader />
      ) : (
        <DataTable ref={dt} value={providers} paginator rows={6}>
          <Column
            field="name"
            header="Nombre"
            sortable
            style={{ minWidth: '12rem' }}
          ></Column>

          <Column
            field="lastName"
            header="Apellido"
            sortable
            style={{ minWidth: '12rem' }}
          ></Column>

          <Column
            field="phone"
            header="Telefono"
            sortable
            style={{ minWidth: '12rem' }}
          ></Column>

          <Column
            field="email"
            header="Email"
            sortable
            style={{ minWidth: '12rem' }}
          ></Column>

          <Column
            header="Acciones"
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: '12rem' }}
          ></Column>
        </DataTable>
      )}
    </React.Fragment>
  );
};

export default Provider;
