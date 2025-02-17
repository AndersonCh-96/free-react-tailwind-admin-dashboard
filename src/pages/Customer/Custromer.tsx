import React, { useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from '../../slices/thunk';
import Loader from '../../common/Loader';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import InputForm from '../../components/Input/InputForm';
import { useFormik } from 'formik';
import * as Yup from 'yup';
const Customer = () => {
  const dispatch: any = useDispatch();
  const customers = useSelector((state: any) => state.Customers.customerList);
  const loading = useSelector((state: any) => state.Customers.loading);
  const dt = useRef<DataTable<any[]>>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [customer, setCustomer] = useState<any>({});
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(getCustomers());
  }, []);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: (customer && customer.name) || '',
      lastName: (customer && customer.lastName) || '',
      phone: (customer && customer.phone) || '',
      email: (customer && customer.email) || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('El nombre es requerido'),
      lastName: Yup.string().required('El apellido es requerido'),
      phone: Yup.string().required('El celular es requerido'),
      email: Yup.string()
        .email('Debe ser un correo valido')
        .required('El correo electronico es requerido'),
    }),
    onSubmit: () => {
      if (isEdit) {
        const newCUstomer = { id: customer.id, ...validation.values };
        dispatch(updateCustomer(newCUstomer));
      } else {
        dispatch(createCustomer(validation.values));
      }

      setIsOpen(false);
    },
  });

  const openModal = () => {
    setCustomer('');
    setIsOpen(true);
    setIsEdit(false);
    validation.resetForm();
  };

  const editOpenModal = (customer: any) => {
    setCustomer(customer);
    setIsEdit(true);
    setIsOpen(true);
  };

  const deleteCustomerData = (customer: any) => {
    setDeleteModal(true);
    if (customer) {
      setCustomer(customer);
    }
  };

  const removeCustomer = (customer: any) => {
    dispatch(deleteCustomer(customer.id));
    setDeleteModal(false);
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className=""
          onClick={() => editOpenModal(rowData)}
        />
        <Button
          className="text-red"
          icon="pi pi-trash"
          severity="danger"
          onClick={() => deleteCustomerData(rowData)}
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
          onClick={openModal}
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

      <Dialog
        visible={isOpen}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Cliente"
        style={{ width: '35rem' }}
        modal
        className=""
        onHide={() => setIsOpen(false)}
      >
        <form
          onSubmit={(e): any => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <InputForm
            label="Nombre"
            name="name"
            validation={validation}
            type="text"
            placeholder="Ingrese el nombre"
            style=""
          />

          <InputForm
            label="Apellido"
            name="lastName"
            validation={validation}
            type="text"
            placeholder="Ingrese el apellido"
            style=""
          />

          <InputForm
            label="Telefono"
            name="phone"
            validation={validation}
            type="text"
            placeholder="Ingrese numero de telefono"
            style=""
          />
          <InputForm
            label="Email"
            name="email"
            validation={validation}
            type="text"
            placeholder="Ingrese correo electronico"
            style=""
          />

          <div className="flex justify-end mt-6">
            <Button
              className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
              label="Cancelar"
              icon="pi pi-times"
              type="button"
              onClick={() => setIsOpen(false)}
            />
            <Button
              className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
              label="Guardar"
              icon="pi pi-check"
              type="submit"
            />
          </div>
        </form>
      </Dialog>

      <Dialog
        visible={deleteModal}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Confirmar"
        modal
        onHide={() => setDeleteModal(false)}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: '2rem' }}
          />
          {customer && (
            <span>
              Esta seguro que desea eliminar a <b>{customer.name}</b>?
            </span>
          )}
        </div>
        <div className="flex justify-end p-2 gap-5 mt-5">
          <Button
            label="No"
            icon="pi pi-times"
            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            onClick={() => {
              setDeleteModal(false);
            }}
          />
          <Button
            label="Si"
            icon="pi pi-check"
            severity="danger"
            className="text-red-500 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            onClick={() => removeCustomer(customer)}
          />
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default Customer;
