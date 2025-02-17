import React, { useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from '../../slices/products/thunk';
import Loader from '../../common/Loader';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import InputForm from '../../components/Input/InputForm';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const Product = () => {
  const [openModal, setOpenModal] = useState(false);
  const [product, setProduct] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);
  const [deleteProductModal, setDeleteProductModal] = useState(false);
  const products = useSelector((state: any) => state.Products.productList);
  const loading = useSelector((state: any) => state.Products.loading);
  const dispatch: any = useDispatch();
  const dt = useRef<DataTable<any[]>>(null);

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      code: (product && product.code) || '',
      name: (product && product.name) || '',
      price: (product && product.price) || '',
      tax: (product && product.tax) || '0',
    },
    validationSchema: Yup.object({
      code: Yup.string().required('El codigo es requerido'),
      name: Yup.string().required('El nombre es requerido'),
      price: Yup.number().required('El precio es requerido'),
      tax: Yup.number().required('El impuesto es requerido'),
    }),
    onSubmit: () => {
      if (isEdit) {
        const productObject = {
          id: product.id,
          ...validation.values,
        };
        console.log('Prodic', productObject);

        dispatch(updateProduct(productObject));
      } else {
        dispatch(createProduct(validation.values));
      }
      setOpenModal(false);
    },
  });

  const openModalProduct = () => {
    setProduct('');
    setIsEdit(false);
    setOpenModal(true);
  };

  const handleEditProduct = (product: any) => {
    console.log('Produic', product);
    setOpenModal(true);
    setIsEdit(true);
    setProduct(product);
  };
  const leftToolbarTemplate = () => {
    return (
      <div>
        <Button
          className="p-2 bg-blue-800 text-white"
          label="Crear producto"
          icon="pi pi-plus"
          severity="success"
          onClick={openModalProduct}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className=""
          onClick={() => handleEditProduct(rowData)}
        />
        <Button
          className="text-red"
          icon="pi pi-trash"
          severity="danger"
          onClick={() => deleteModal(rowData)}
        />
      </React.Fragment>
    );
  };

  const deleteModal = (product: any) => {
    setProduct(product);
    setDeleteProductModal(true);
  };

  const removeProduct = (product: any) => {
    const { id } = product;
    if (id) {
      dispatch(deleteProduct(id));
    }
    setDeleteProductModal(false);
  };

  return (
    <React.Fragment>
      <Breadcrumb pageName="Productos" />

      <div className="card">
        <Toolbar className="mb-4" start={leftToolbarTemplate} />

        {loading ? (
          <Loader />
        ) : (
          <DataTable ref={dt} value={products} rows={10} paginator>
            <Column
              field="code"
              header="Codigo"
              sortable
              style={{ minWidth: '12rem' }}
            ></Column>

            <Column
              field="name"
              header="Nombre"
              sortable
              style={{ minWidth: '12rem' }}
            ></Column>

            <Column
              field="price"
              header="Precio"
              sortable
              style={{ minWidth: '12rem' }}
            ></Column>

            <Column
              field="tax"
              header="Impuesto"
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
      </div>

      <Dialog
        visible={openModal}
        header="Producto"
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        modal
        onHide={() => {
          setOpenModal(false);
          validation.resetForm();
        }}
      >
        <form
          onSubmit={(e: any) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <div className="flex gap-2">
            <InputForm
              label="Codigo"
              name="code"
              validation={validation}
              type="text"
              placeholder="Ingrese el codigo"
              style="w-40"
            />
            <InputForm
              label="Nombre del producto"
              name="name"
              validation={validation}
              type="text"
              placeholder="Ingrese producto"
              style=""
            />
          </div>
          <div className="flex gap-2">
            <InputForm
              label="Precio"
              name="price"
              validation={validation}
              type="number"
              placeholder="Ingrese el precio"
              style="w-40"
            />
            <InputForm
              label="Impuesto"
              name="tax"
              validation={validation}
              type="number"
              placeholder="Ingrese impusto"
              style=""
            />
          </div>

          <div className="flex justify-end mt-10">
            <Button
              className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
              label="Cancelar"
              icon="pi pi-times"
              type="button"
              onClick={() => {
                setOpenModal(false);
                validation.resetForm();
              }}
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
        visible={deleteProductModal}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Confirmar"
        modal
        onHide={() => setDeleteProductModal(false)}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: '2rem' }}
          />
          {product && (
            <span>
              Esta seguro que desea eliminar a <b>{product.name}</b>?
            </span>
          )}
        </div>
        <div className="flex justify-end p-2 gap-5 mt-5">
          <Button
            label="No"
            icon="pi pi-times"
            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            onClick={() => setDeleteProductModal(false)}
          />
          <Button
            label="Si"
            icon="pi pi-check"
            severity="danger"
            className="text-red-500 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            onClick={() => removeProduct(product)}
          />
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default Product;
