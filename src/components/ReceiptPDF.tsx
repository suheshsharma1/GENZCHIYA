import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Order } from '../types';

interface ReceiptPDFProps {
  order: Order | null;
  elementId: string;
}

export const ReceiptPDF: React.FC<ReceiptPDFProps> = ({ order, elementId }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (order) {
      // Generate QR code encoding order URL or simple verification text
      const orderUrl = `${window.location.origin}/menu?table=${order.tableNumber}`;
      QRCode.toDataURL(orderUrl, { margin: 1, width: 120 })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error('Error generating QR on receipt', err));
    }
  }, [order]);

  if (!order) return null;

  const formattedDate = new Date(order.createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div
      id={elementId}
      style={{
        position: 'absolute',
        left: '-9999px', // Hide off-screen
        width: '320px',  // Tight layout for standard thermal receipt width
        fontFamily: 'Courier, monospace',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        padding: '20px 15px',
        lineHeight: '1.3',
        fontSize: '12px'
      }}
      className="receipt-print-wrapper border border-slate-100"
    >
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 2px 0', letterSpacing: '1px' }}>
          GENZCHIYA
        </h2>
        <p style={{ margin: '0 0 2px 0', fontSize: '10px' }}>SMART TEA CAFÉ</p>
        <p style={{ margin: '0', fontSize: '9px' }}>Mid-Baneshwor, Kathmandu, Nepal</p>
        <p style={{ margin: '0', fontSize: '9px' }}>Tel: +977-1-4455667 | PAN: 609876543</p>
      </div>

      {/* Divider */}
      <div style={{ borderBottom: '1px dashed #000000', margin: '10px 0' }}></div>

      {/* Invoice Meta */}
      <div style={{ marginBottom: '10px', fontSize: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Invoice No:</span>
          <span style={{ fontWeight: 'bold' }}>{order.id}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
          <span>Date/Time:</span>
          <span>{formattedDate}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
          <span>Table No:</span>
          <span style={{ fontWeight: 'bold' }}>{order.tableNumber === 'Takeaway' ? 'Takeaway' : `Table ${order.tableNumber}`}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
          <span>Customer:</span>
          <span>{order.customerName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
          <span>Payment:</span>
          <span>
            {order.payment.method.toUpperCase()} ({order.payment.status === 'success' ? 'PAID' : 'UNPAID'})
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderBottom: '1px dashed #000000', margin: '10px 0' }}></div>

      {/* Item Headers */}
      <div style={{ display: 'flex', fontWeight: 'bold', marginBottom: '5px', fontSize: '10px' }}>
        <span style={{ flex: '2' }}>Item Description</span>
        <span style={{ flex: '0.5', textAlign: 'center' }}>Qty</span>
        <span style={{ flex: '1', textAlign: 'right' }}>Amount</span>
      </div>

      {/* Divider */}
      <div style={{ borderBottom: '1px solid #000000', marginBottom: '8px' }}></div>

      {/* Order Items */}
      <div>
        {order.items.map((item, idx) => {
          // Calculate single item cost + customization costs
          const customCost = item.selectedCustomizations.reduce((cSum, cust) => 
            cSum + cust.selections.reduce((sSum, sel) => sSum + sel.price, 0), 0
          );

          return (
            <div key={idx} style={{ marginBottom: '8px', fontSize: '10px' }}>
              <div style={{ display: 'flex' }}>
                <span style={{ flex: '2', fontWeight: 'medium' }}>{item.product.name}</span>
                <span style={{ flex: '0.5', textAlign: 'center' }}>{item.quantity}</span>
                <span style={{ flex: '1', textAlign: 'right' }}>{(item.product.price * item.quantity).toFixed(0)}</span>
              </div>
              
              {/* Customizations details */}
              {item.selectedCustomizations.length > 0 && (
                <div style={{ paddingLeft: '8px', fontSize: '8px', color: '#555555', fontStyle: 'italic', marginTop: '2px' }}>
                  {item.selectedCustomizations.map((cust, cIdx) => (
                    <div key={cIdx}>
                      + {cust.name}: {cust.selections.map(sel => `${sel.name} (${sel.price > 0 ? `+${sel.price}` : 'Free'})`).join(', ')}
                    </div>
                  ))}
                </div>
              )}
              {/* Customization charges total row if applicable */}
              {customCost > 0 && (
                <div style={{ display: 'flex', fontSize: '8px', color: '#555555', paddingLeft: '8px' }}>
                  <span style={{ flex: '2' }}>- Customization Add-ons</span>
                  <span style={{ flex: '0.5', textAlign: 'center' }}>{item.quantity}</span>
                  <span style={{ flex: '1', textAlign: 'right' }}>+{(customCost * item.quantity).toFixed(0)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ borderBottom: '1px solid #000000', margin: '10px 0' }}></div>

      {/* Bill Totals */}
      <div style={{ fontSize: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal:</span>
          <span>Rs. {order.subtotal.toFixed(0)}</span>
        </div>
        {order.discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px', fontWeight: 'bold' }}>
            <span>Discount:</span>
            <span>-Rs. {order.discount.toFixed(0)}</span>
          </div>
        )}
        
        {/* Grand Total */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontWeight: 'bold', fontSize: '13px', borderTop: '1px dashed #000000', paddingTop: '4px' }}>
          <span>Grand Total:</span>
          <span>Rs. {order.total.toFixed(0)}</span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderBottom: '1px dashed #000000', margin: '15px 0 10px 0' }}></div>

      {/* QR Code and Footer Message */}
      <div style={{ textAlign: 'center' }}>
        {qrCodeUrl && (
          <div style={{ margin: '8px auto' }}>
            <img 
              src={qrCodeUrl} 
              alt="Receipt QR" 
              style={{ width: '80px', height: '80px', display: 'block', margin: '0 auto' }} 
            />
            <span style={{ fontSize: '7px', color: '#555555', display: 'block', marginTop: '2px' }}>
              Scan QR code to order from table
            </span>
          </div>
        )}
        
        <p style={{ margin: '10px 0 0 0', fontWeight: 'bold', fontSize: '9px' }}>
          THANK YOU FOR VISITING!
        </p>
        <p style={{ margin: '2px 0 0 0', fontSize: '8px' }}>
          Powered by GENZCHIYA Ordering Systems
        </p>
      </div>
    </div>
  );
};
export default ReceiptPDF;
