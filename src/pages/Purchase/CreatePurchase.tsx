import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  createPurchase,
  getAllProducts,
  getProviders,
} from '../../slices/thunk';
import { Dropdown } from 'primereact/dropdown';
import * as Yup from 'yup';
import { InputText } from 'primereact/inputtext';
import InputForm from '../../components/Input/InputForm';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Toolbar } from 'primereact/toolbar';
import { useNavigate } from 'react-router-dom';

const CreatePurchase = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const [date, setDate] = useState(null);
  const [selectProduct, setSelectProduct] = useState<any>([]);

  const providers = useSelector((state: any) => state.Providers.providerList);
  const products = useSelector((state: any) => state.Products.productList);

  useEffect(() => {
    dispatch(getProviders());
    dispatch(getAllProducts());
  }, []);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      date: '',
      provider: '',
      notes: '',
      productDetails: [],
    },
    validationSchema: Yup.object({
      date: Yup.date().required('La fecha es requerida'),
      provider: Yup.string().required('El proveedor es requerido'),
      productDetails: Yup.array().of(
        Yup.object().shape({
          unitCost: Yup.number().required('El costo unitario es requerido'),
          quantity: Yup.number().required('la cantidad es requerida'),
        }),
      ),
      notes: Yup.string().required('La nota es requerida'),
    }),
    onSubmit: () => {
      const newPurchase = {
        date: validation.values.date,
        provider: validation.values.provider,
        notes: validation.values.notes,
        purchaseDetails: validation.values.productDetails.map((item: any) => {
          return {
            quantity: item.quantity,
            price: item.unitCost,
            product: item.product,
          };
        }),
      };

      dispatch(createPurchase(newPurchase));
      navigate('/purchases')
    
    },
  });

  const selectProductsArray = (product: any) => {
    const productItems = [
      ...validation.values.productDetails,
      { product: product.code, name: product.name },
    ];
    validation.setFieldValue('productDetails', productItems);
  };

  const handleUnitCost = (unitCost: any, index: number) => {
    const updateUnitCost = validation.values.productDetails.map(
      (item: any, idx: any) =>
        idx === index ? { ...item, unitCost: unitCost } : item,
    );

    validation.setFieldValue('productDetails', [...updateUnitCost]);
  };

  const handleQuantity = (quantity: any, index: number) => {
    const updateQuantity = validation.values.productDetails.map(
      (item: any, idx: any) =>
        idx === index ? { ...item, quantity: quantity } : item,
    );

    validation.setFieldValue('productDetails', [...updateQuantity]);
  };

  const handleRemove = (index: any) => {
    const newList = validation.values.productDetails.filter(
      (item: any, idx: any) => idx !== index,
    );
    validation.setFieldValue('productDetails', [...newList]);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          className="p-2 bg-blue-800 text-white"
          label="Regresar"
          icon="pi pi-arrow-left"
          severity="success"
          onClick={() => {
            navigate('/purchases');
          }}
        />
      </div>
    );
  };

  const handleProvider = (e: any) => {
    validation.setFieldValue('provider', e.value.code);
  };
  return (
    <React.Fragment>
      <Breadcrumb pageName="Crear compra" />
      <Toolbar className="mb-4" start={leftToolbarTemplate} />

      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          validation.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-5">
          <div className="flex gap-5">
            <div className="flex flex-col text-lg gap-2">
              <label className="font-bold">Fecha</label>
              <InputText
                type="date"
                name="date"
                value={validation.values.date}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                className="p-2"
                placeholder="Ingrese fecha"
              />
              {validation.errors.date && validation.touched.date && (
                <p className="text-sm text-red-500">{validation.errors.date}</p>
              )}
            </div>

            <div className="flex flex-col text-lg gap-2">
              <label className="font-bold">Proveedor</label>
              <Dropdown
                name="provider"
                editable
                value={
                  providers.find(
                    (item: any) => item.id === validation.values.provider,
                  )?.name || ''
                }
                onChange={handleProvider}
                onBlur={validation.handleBlur}
                options={providers.map((item: any) => {
                  return {
                    name: item.name,
                    code: item.id,
                  };
                })}
                className="p-2"
                optionLabel="name"
                placeholder="Ingrese un proveedor"
              />
              {validation.errors.provider && validation.touched.provider && (
                <p className="text-sm text-red-500">
                  {validation.errors.provider}
                </p>
              )}
            </div>
          </div>
          <div className="mt-8">
            <Dropdown
              name="product"
              editable
              value={selectProduct}
              onChange={(e) => {
                const product = e.target.value;
                setSelectProduct(product);
                selectProductsArray(product);
              }}
              options={products.map((item: any) => {
                return {
                  name: item.name,
                  code: item.id,
                };
              })}
              className="p-2"
              optionLabel="name"
              placeholder="Seleccione un producto"
            />
          </div>

          <div>
            {validation.values.productDetails.length == 0 ? (
              <Message
                severity="info"
                className="w-full"
                content="No hay productos agregados"
              />
            ) : (
              validation.values.productDetails.map(
                (item: any, index: number) => (
                  <React.Fragment key={index}>
                    <div className="mt-10 flex gap-4 ">
                      <div className="flex flex-col gap-2">
                        <label className="font-bold">Producto</label>
                        <label>{item.name}</label>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-bold">Precio</label>
                        <InputText
                          className="p-2 w-auto"
                          type="number"
                          name="unitCost"
                          onBlur={validation.handleBlur}
                          placeholder="Ingrese precio"
                          value={
                            validation.values.productDetails[index].unitCost ??
                            ''
                          }
                          onChange={(e) => {
                            handleUnitCost(e.target.value, index);
                          }}
                        />

                        {/* {validation.errors.productDetails &&
                          validation.errors.productDetails[index].unitCost &&
                          validation.touched.productDetails &&
                          validation.touched.productDetails[index].unitCost && (
                            <p className="text-sm text-red-500">
                              {validation.errors.productDetails[index].unitCost}
                            </p>
                          )} */}
                      </div>

                      <div className="flex flex-col font-bold gap-2">
                        <label> Cantidad</label>
                        <InputText
                          className="p-2"
                          type="number"
                          name="quantity"
                          onBlur={validation.handleBlur}
                          placeholder="Ingrese cantidad"
                          value={
                            validation.values.productDetails[index].quantity ??
                            ''
                          }
                          onChange={(e) => {
                            handleQuantity(e.target.value, index);
                          }}
                        />
                        {validation.errors.quantity &&
                          validation.touched.quantity && (
                            <p className="text-sm text-red-500">
                              {validation.errors.quantity}
                            </p>
                          )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-bold">Total</label>
                        <InputText
                          disabled
                          type="number"
                          className="p-2"
                          value={(
                            parseFloat(
                              validation.values.productDetails[index].unitCost,
                            ) *
                            parseInt(
                              validation.values.productDetails[index].quantity,
                            )
                          ).toFixed(2)}
                        />
                      </div>
                      <div className="flex items-center">
                        <Button
                          type="button"
                          icon="pi pi-trash"
                          size="large"
                          className="text-danger font-bold"
                          onClick={() => handleRemove(index)}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                ),
              )
            )}
          </div>

          <div className="flex flex-col ">
            <label className="font-bold text-lg mb-2">Nota</label>
            <InputTextarea
              value={validation.values.notes}
              name="notes"
              onChange={validation.handleChange}
              rows={3}
              cols={20}
              placeholder="Ingrese una nota"
              className="p-3"
            />
            {validation.errors.notes && validation.touched.notes && (
              <p className="text-sm text-red-500">{validation.errors.notes}</p>
            )}
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="bg-success text-white p-4 mt-6"
            label="Guardar"
          />
        </div>
      </form>
    </React.Fragment>
  );
};

export default CreatePurchase;
