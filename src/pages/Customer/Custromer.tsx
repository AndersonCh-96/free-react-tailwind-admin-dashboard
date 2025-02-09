import React, { useEffect, useRef } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomers } from '../../slices/thunk';
import Loader from '../../common/Loader';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
const Customer = () => {
  const dispatch: any = useDispatch();
  const customers = useSelector((state: any) => state.Customers.customerList);
  const loading = useSelector((state: any) => state.Customers.loading);
  const dt = useRef<DataTable<any[]>>(null);

  console.log('Customer', customers);

  useEffect(() => {
    dispatch(getCustomers());
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
          label="Crear cliente"
          icon="pi pi-plus"
          severity="success"
          onClick={() => {}}
        />
      </div>
    );
  };

  return (
    <React.Fragment>
      <Breadcrumb pageName="Clientes" />
      <Toolbar className="mb-4" start={leftToolbarTemplate} />

      {loading ? (
        <Loader />
      ) : (
        <DataTable ref={dt} value={customers} paginator rows={6}>
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

export default Customer;
