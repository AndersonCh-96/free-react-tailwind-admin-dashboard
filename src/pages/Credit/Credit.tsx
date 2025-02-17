import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import {
  createPyamentCredit,
  getCredits,
  getCustomerCredits,
} from '../../slices/thunk';
import Loader from '../../common/Loader';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

const Credit = () => {
  const dispatch: any = useDispatch();
  const credits = useSelector((state: any) => state.Credits.creditsList);
  const loading = useSelector((state: any) => state.Credits.loading);
  const [openModalCredit, setOpenModalCredit] = useState(false);
  const [openModalPayment, setOpenModalPayment] = useState(false);
  const [selectPayment, setSelectPayment] = useState([]);
  const [customerId, setCustomerId] = useState({});

  const [totalDue, setTotalDue] = useState<any>();

  const creditsDetails = useSelector(
    (state: any) => state.Credits.creditCustomer,
  );
  useEffect(() => {
    dispatch(getCredits());
  }, [dispatch]);

  const paymentMethods = [
    { code: 'Cash', name: 'Efectivo' },
    { code: 'Transfer', name: 'Transferencia' },
  ];

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      paymentMethods: [],
    },
    validationSchema: Yup.object({
      paymentMethods: Yup.array().of(
        Yup.object().shape({
          amount: Yup.number().required('La cantidad es requerida'),
        }),
      ),
    }),
    onSubmit: () => {
      const objetct = {
        customer: customerId,
        paymentMethods: [...validation.values.paymentMethods],
      };

      dispatch(createPyamentCredit(objetct));
      dispatch(getCredits());
      setOpenModalPayment(false);
    },
  });
  const leftToolbarTemplate = () => {
    return (
      <div className="flex  gap-2 justify-center">
        <h1 className="font-bold text-center text-lg text-black">
          Lista de deudores
        </h1>
      </div>
    );
  };

  const viewCreditsCustomer = (customer: any) => {
    setOpenModalCredit(true);
    const { id } = customer;

    if (id) {
      dispatch(getCustomerCredits(id));
    }
  };

  const paymentMethod = (customer: any) => {
    setCustomerId(customer.id);
    setOpenModalPayment(true);
  };

  const selectMethodPayment = (paymentMethod: any) => {
    const paymentItems = [
      ...validation.values.paymentMethods,
      { type: paymentMethod.code },
    ];

    validation.setFieldValue('paymentMethods', paymentItems);
  };

  const handleAmount = (amount: any, index: number) => {
    const updateAmount = validation.values.paymentMethods.map(
      (item: any, idx: any) =>
        idx === index ? { ...item, amount: amount } : item,
    );

    validation.setFieldValue('paymentMethods', [...updateAmount]);
  };

  const deletePaymentMethods = (index: number) => {
    const newList = validation.values.paymentMethods.filter(
      (item: any, idx: number) => idx !== index,
    );

    validation.setFieldValue('paymentMethods', [...newList]);
  };

  console.log('valida', validation.values.paymentMethods);
  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <Button
          size="large"
          icon="pi pi-eye"
          className=""
          onClick={() => viewCreditsCustomer(rowData)}
        />
        <Button
          size="large"
          className="text-green-500"
          icon="pi pi-money-bill"
          severity="danger"
          onClick={() => paymentMethod(rowData)}
        />
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <Breadcrumb pageName="Deudores" />
      <Toolbar className="mb-4" center={leftToolbarTemplate}></Toolbar>

      {loading ? (
        <Loader />
      ) : (
        <DataTable value={credits} className="" paginator rows={10}>
          <Column
            field="name"
            header="Cliente"
            sortable
            style={{ minWidth: '7rem' }}
          ></Column>

          <Column
            field="lastName"
            header="Apellido"
            sortable
            style={{ minWidth: '7rem' }}
          ></Column>

          <Column
            field="phone"
            header="Telefono"
            sortable
            style={{ minWidth: '7rem' }}
          ></Column>

          <Column
            field="email"
            header="Correo electronico"
            sortable
            style={{ minWidth: '7rem' }}
          ></Column>

          <Column
            field=""
            header="Total deuda"
            body={(rowData) => {
              const totalDue = rowData.credit.reduce((acc: any, item: any) => {
                return acc + item.dueAmount;
              }, 0);

              return `$${totalDue}`;
            }}
            sortable
            style={{ minWidth: '7rem' }}
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
        visible={openModalCredit}
        style={{ width: '50vw' }}
        header="Detalle de creditos"
        modal
        onHide={() => setOpenModalCredit(false)}
      >
        <DataTable size="small" value={creditsDetails.credit}>
          <Column field="createdAt" header="Fecha"></Column>
          <Column
            field="dueAmount"
            body={(rowData) => `$${rowData.dueAmount.toFixed(2)}`}
            header="Debe"
          ></Column>
          <Column
            field="paidAmount"
            body={(rowData) => `$${rowData.paidAmount.toFixed(2)}`}
            header="Pagado"
          ></Column>
          <Column
            field="totalAmount"
            body={(rowData) => `$${rowData.totalAmount.toFixed(2)}`}
            header="Total"
          ></Column>
        </DataTable>
      </Dialog>

      <Dialog
        visible={openModalPayment}
        style={{ width: '50vw' }}
        className=""
        header="Crear pago"
        modal
        onHide={() => setOpenModalPayment(false)}
      >
        <form
          onSubmit={(e: any) => {
            e.preventDefault();
            validation.handleSubmit();
            console.log('Valida', validation.values);
          }}
        >
          <div className="flex flex-col gap-6">
            <div>
              <Dropdown
                name="paymentMethods"
                className="w-full"
                placeholder="Seleccione un metodo de pago"
                value={selectPayment}
                options={paymentMethods}
                onChange={(e) => {
                  const paymentMethod = e.target.value;
                  setSelectPayment(paymentMethod);
                  selectMethodPayment(paymentMethod);

                  console.log('Payme', paymentMethod);
                }}
                optionLabel="name"
              />
            </div>

            {validation.values.paymentMethods.map(
              (item: any, index: number) => {
                return (
                  <React.Fragment key={index}>
                    <div className="flex">
                      <div className="flex flex-col">
                        <label>Tipo</label>
                        <InputText
                          disabled
                          name="type"
                          value={
                            item.type === 'Cash' ? 'Efectivo' : 'Transferencia'
                          }
                        />
                      </div>
                      <div className="flex flex-col">
                        <label>Cantidad</label>
                        <InputText
                          className="w-48 p-2 border border-1"
                          type="number"
                          name="amount"
                          value={
                            validation.values.paymentMethods[index].amount ?? ''
                          }
                          onBlur={validation.handleBlur}
                          onChange={(e) => {
                            handleAmount(e.target.value, index);
                          }}
                          placeholder="Ingrese la cantidad"
                        />
                      </div>
                      <div className="flex">
                        <Button
                          onClick={() => {
                            deletePaymentMethods(index);
                          }}
                          className="text-red"
                          icon="pi pi-trash"
                        />
                      </div>
                    </div>
                  </React.Fragment>
                );
              },
            )}

            <Button
              className="p-3 bg-blue-800 text-white mt-6"
              type="submit"
              label="Guardar"
            />
          </div>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default Credit;
