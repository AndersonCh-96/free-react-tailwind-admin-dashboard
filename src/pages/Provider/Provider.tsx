import React, { useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import {
  createProvider,
  deleteProviderData,
  getProviders,
  updateProvider,
} from '../../slices/thunk';
import Loader from '../../common/Loader';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { useFormik } from 'formik';
import { Dialog } from 'primereact/dialog';
import * as Yup from 'yup';
import InputForm from '../../components/Input/InputForm';
const Provider = () => {
  const dispatch: any = useDispatch();
  const dt = useRef<DataTable<any[]>>(null);
  const providers = useSelector((state: any) => state.Providers.providerList);
  const loading = useSelector((state: any) => state.Providers.loading);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [deleteProvider, setDeleteProvider] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [provider, setProvider] = useState<any>({});

  useEffect(() => {
    dispatch(getProviders());
  }, []);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: (provider && provider.name) || '',
      lastName: (provider && provider.lastName) || '',
      phone: (provider && provider.phone) || '',
      email: (provider && provider.email) || '',
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
        const editObject = { id: provider.id, ...validation.values };
        dispatch(updateProvider(editObject));
      } else {
        dispatch(createProvider(validation.values));
      }

      setIsOpenModal(false);
    },
  });

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className=""
          onClick={() => editProvider(rowData)}
        />
        <Button
          className="text-red"
          icon="pi pi-trash"
          severity="danger"
          onClick={() => confirmDelete(rowData)}
        />
      </React.Fragment>
    );
  };

  const openModalCustomer = () => {
    setIsEdit(false);
    setIsOpenModal(true);
    setProvider('');
    validation.resetForm();
  };

  const editProvider = (provider: any) => {
    setProvider(provider);
    setIsEdit(true);
    setIsOpenModal(true);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          className="p-2 bg-blue-800 text-white"
          label="Crear proveedor"
          icon="pi pi-plus"
          severity="success"
          onClick={openModalCustomer}
        />
      </div>
    );
  };

  const confirmDelete = (provider: any) => {
    setDeleteProvider(true);
    setProvider(provider);
  };

  const removeProvider = (provider: any) => {
    const { id } = provider;
    if (id) {
      dispatch(deleteProviderData(id));
    }
    setDeleteProvider(false);
  };

  return (
    <React.Fragment>
      <Breadcrumb pageName="Proveedores" />

      <Toolbar className="mb-4" start={leftToolbarTemplate} />

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

      <Dialog
        visible={isOpenModal}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Proveedor"
        style={{ width: '35rem' }}
        modal
        className=""
        onHide={() => setIsOpenModal(false)}
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
              onClick={() => setIsOpenModal(false)}
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
        visible={deleteProvider}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Confirmar"
        modal
        onHide={() => {
          setDeleteProvider(false);
        }}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: '2rem' }}
          />
          {provider && (
            <span>
              Esta seguro que desea eliminar a <b>{provider.name}</b>?
            </span>
          )}
        </div>
        <div className="flex justify-end p-2 gap-5 mt-5">
          <Button
            label="No"
            icon="pi pi-times"
            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            onClick={() => {
              setDeleteProvider(false);
            }}
          />
          <Button
            label="Si"
            icon="pi pi-check"
            severity="danger"
            className="text-red-500 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            onClick={() => removeProvider(provider)}
          />
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default Provider;
