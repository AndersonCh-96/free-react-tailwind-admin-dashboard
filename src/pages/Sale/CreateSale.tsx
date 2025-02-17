import React, { act, useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { createSale, getAllProducts, getCustomers } from '../../slices/thunk';
import { Dropdown } from 'primereact/dropdown';
import * as Yup from 'yup';
import { Message } from 'primereact/message';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import toast from 'react-hot-toast';
import { Steps } from 'primereact/steps';
const CreateSale = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();

  const customers = useSelector((state: any) => state.Customers.customerList);
  const products = useSelector((state: any) => state.Products.productList);
  const [selectProduct, setSelectProduct] = useState<any>([]);
  const [selectPayment, setSelectPayment] = useState<any>([]);
  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getAllProducts());
  }, []);

  const paymentType = [
    { name: 'Efectivo', code: 'Cash' },
    { name: 'Credito', code: 'Credit' },
  ];

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      date: '',
      customer: '',
      notes: '',
      saleDetails: [],
      paymentMethods: [],
    },
    validationSchema: Yup.object({
      date: Yup.string().required('La fecha es requerida'),
      customer: Yup.string().required('El cliente es requerido'),
      notes: Yup.string().required('La nota es requerida'),
      saleDetails: Yup.array().of(
        Yup.object().shape({
          product: Yup.string().required('El producto es requerido'),
          quantity: Yup.number().required('La cantidad es requerida'),
          unitCost: Yup.number().required('El precio es requerido'),
        }),
      ),
      paymentMethods: Yup.array().of(
        Yup.object().shape({
          amount: Yup.number().required('El monto es requerido'),
          type: Yup.string().required('El tipo de pago es requerido'),
        }),
      ),
    }),
    onSubmit: () => {
      //Si no est en el ultimo permite avanzar un paso

      const newSale = {
        date: validation.values.date,
        customer: validation.values.customer,
        notes: validation.values.notes,
        saleDetails: validation.values.saleDetails.map((item: any) => {
          return {
            quantity: item.quantity,
            unitCost: item.unitCost,
            product: item.product,
            taxPercentage: 0,
          };
        }),
        paymentMethods: validation.values.paymentMethods.map((item: any) => {
          return {
            amount: item.amount,
            type: item.type,
          };
        }),
      };
      console.log('NUeva venta', newSale);

      dispatch(createSale(newSale));
      navigate('/sales');
    },
  });

  const handleSelectPayment = (payment: any) => {
    const paymentItems = [
      ...validation.values.paymentMethods,
      { type: payment.code },
    ];
    validation.setFieldValue('paymentMethods', paymentItems);
  };

  console.log('Item', validation.values.paymentMethods);
  const selectProductsArray = (product: any) => {
    const productItems = [
      ...validation.values.saleDetails,
      {
        product: product.code,
        name: product.name,
        stock: product.stock?.stock,
      },
    ];
    validation.setFieldValue('saleDetails', productItems);
  };

  console.log('VAA', validation.values.saleDetails);
  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          className="p-2 bg-blue-800 text-white"
          label="Regresar"
          icon="pi pi-arrow-left"
          severity="success"
          onClick={() => {
            navigate('/sales');
          }}
        />
      </div>
    );
  };

  const handleCustomer = (e: any) => {
    validation.setFieldValue('customer', e.value.code);
  };

  const handleUnitCost = (unitCost: any, index: number) => {
    const updateUnitCost = validation.values.saleDetails.map(
      (item: any, idx: any) =>
        idx === index ? { ...item, unitCost: unitCost } : item,
    );

    validation.setFieldValue('saleDetails', [...updateUnitCost]);
  };

  const handleQuantity = (quantity: any, index: number) => {
    if (parseInt(quantity) > validation.values.saleDetails[index].stock) {
      toast('La cantidad ingresada supera el stock');
      return;
    }
    const updateQuantity = validation.values.saleDetails.map(
      (item: any, idx: any) =>
        idx === index ? { ...item, quantity: quantity } : item,
    );

    validation.setFieldValue('saleDetails', [...updateQuantity]);
  };

  const handleRemove = (index: any) => {
    const newList = validation.values.saleDetails.filter(
      (item: any, idx: any) => idx !== index,
    );
    validation.setFieldValue('saleDetails', [...newList]);
  };

  const handleAmount = (amount: any, index: number) => {
    const updateQuantity = validation.values.paymentMethods.map(
      (item: any, idx: any) =>
        idx === index ? { ...item, amount: amount } : item,
    );

    validation.setFieldValue('paymentMethods', [...updateQuantity]);
  };

  return (
    <React.Fragment>
      <Toolbar className="mb-4" start={leftToolbarTemplate} />

      <Breadcrumb pageName="Crear venta" />

      <form
        onSubmit={(e: any) => {
          e.preventDefault();

          validation.handleSubmit();
        }}
      >
        <div>
          <div>
            <div className="flex gap-4">
              <div className="flex flex-col text-lg gap-2">
                <label>Fecha</label>
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
                  <p className="text-sm text-red-500">
                    {validation.errors.date}
                  </p>
                )}
              </div>

              <div className="flex flex-col text-lg gap-2">
                <label>Cliente</label>
                <Dropdown
                  name="customer"
                  editable
                  value={
                    customers.find(
                      (item: any) => item.id === validation.values.customer,
                    )?.name || ''
                  }
                  onChange={handleCustomer}
                  onBlur={validation.handleBlur}
                  options={customers.map((item: any) => {
                    return {
                      name: item.name,
                      code: item.id,
                    };
                  })}
                  className="p-2"
                  optionLabel="name"
                  placeholder="Ingrese cliente"
                />
                {validation.errors.customer && validation.touched.customer && (
                  <p className="text-sm text-red-500">
                    {validation.errors.customer}
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
                  const { inventory } = item;
                  return {
                    name: item.name,
                    code: item.id,
                    stock: inventory,
                  };
                })}
                className="p-2"
                optionLabel="name"
                placeholder="Seleccione un producto"
              />
            </div>

            <div>
              {validation.values.saleDetails.length == 0 ? (
                <Message
                  severity="info"
                  className="w-full mt-6"
                  content="No hay productos agregados"
                />
              ) : (
                validation.values.saleDetails.map(
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
                              validation.values.saleDetails[index].unitCost ??
                              ''
                            }
                            onChange={(e) => {
                              handleUnitCost(e.target.value, index);
                            }}
                          />
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
                              validation.values.saleDetails[index].quantity ??
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
                                validation.values.saleDetails[index].unitCost,
                              ) *
                              parseInt(
                                validation.values.saleDetails[index].quantity,
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

                        <div className="flex flex-col gap-2">
                          <label className="font-bold">Stock</label>
                          <label>{item.stock}</label>
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
                <p className="text-sm text-red-500">
                  {validation.errors.notes}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6 mt-10">
            <div className="flex flex-col  justify-center items-center">
              <label className="font-bold mb-3  text-lg flex items-center justify-center">
                Forma de pago
              </label>
              <Dropdown
                name="payment"
                value={selectPayment}
                placeholder="Seleccione un metodo de pago"
                optionLabel="name"
                onChange={(e) => {
                  const payment = e.target.value;
                  setSelectPayment(payment);
                  handleSelectPayment(payment);
                }}
                className="p-2 w-96 justify-center text-center"
                options={paymentType.map((item: any) => {
                  return {
                    name: item.name,
                    code: item.code,
                  };
                })}
              />
            </div>

            <div>
              {validation.values.paymentMethods.length === 0 ? (
                <Message
                  severity="info"
                  className="w-full"
                  content="No tiene seleccionado un metodo de pago"
                />
              ) : (
                validation.values.paymentMethods.map(
                  (item: any, index: number) => {
                    return (
                      <React.Fragment key={index}>
                        <div>
                          <div className="flex justify-center">
                            <div className="flex flex-col gap-2">
                              <label className="font-bold mb-2 mt-2">
                                {' '}
                                {item.type === 'Cash' ? 'Efectivo' : 'Credito'}
                              </label>
                              <InputText
                                type="number"
                                className="p-2"
                                name="amount"
                                onBlur={validation.handleBlur}
                                value={
                                  validation.values.paymentMethods[index]
                                    .amount ?? ''
                                }
                                onChange={(e: any) => {
                                  handleAmount(e.target.value, index);
                                }}
                                placeholder="Ingrese monto"
                              />
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  },
                )
              )}
            </div>
          </div>

          <Button
            type="submit"
            className=" bg-blue-800 text-white p-4 mt-8"
            label="Guardar"
          />
        </div>
      </form>
    </React.Fragment>
  );
};

export default CreateSale;
