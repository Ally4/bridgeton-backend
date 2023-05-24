const verifyUserTemplate = (singUpLink, name) => (
  `<div style="width:100%;background:#efefef;font-family:'Open Sans', sans-serif;font-weight:300">
<!-- HEADER -->
<div style="padding:10px 25px;font-size:45px;font-weight:bold;text-align:center">
   NISISI
</div>
<!-- BODY -->
<div style="max-width:700px;background:#ffffff;width:96%;margin:15px auto;font-size:16px;display:block;border:1px solid #cdcdcd;border-top:none;padding:0;box-shadow:0 0 25px rgba(0,0,0,0.17)">
   <div style="background:#202020;height:12px"></div>
   <div style="padding:25px">
Dear ${name},<br/><br/>
     
     Thank you so much for creating an account on Nisisi, For security reasons we would like you to verify your email by just clicking the button bellow.
      <br>
<p>
<br>
<a
  href='${singUpLink}'
  style="margin:35px 0;padding:15px 35px;background:#202020;color:#ffffff;clear:both;border-radius:4px;text-decoration:none"
  target='_blank'
>
Activate account Now
</a>
<br>
</p>         
      <br>
         <br>
     
      Best regards,<br>
    Nisisi Team
   </div>
</div>
<div style="padding:5px 30px;text-align:center">Take control of your style, we have put the power in your hands; <b>stand out</b> of the cloud</div>
<div style="text-align:center;padding:10px 25px 35px 25px;color:#878787">
   <div>  &copy;Copyright 20, <b>Nisisi</b> Ltd</div>
</div>
<!-- BODY, END -->
</div>`);


export const placedOrderTemplate = ({ name, items, totalAmount }) => (
   `<div style="width:100%;background:#efefef;font-family:'Open Sans', sans-serif;font-weight:300">
      <!-- HEADER -->
      <div style="padding:10px 25px;font-size:45px;font-weight:bold;text-align:center">
         NISISI
      </div>
      <!-- BODY -->
      <div style="max-width:700px;background:#ffffff;width:96%;margin:15px auto;font-size:16px;display:block;border:1px solid #cdcdcd;border-top:none;padding:0;box-shadow:0 0 25px rgba(0,0,0,0.17)">
         <div style="background:#202020;height:12px"></div>
         <div style="padding:25px">
            An order has been placed by ${name},<br/><br/>
            
            <table style="border-collapse: collapse;" border="1">
               <tr>
                  <th>No.</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Sub total</th>
               </tr>
               ${items.map((item, index) => (
                  `
                  <tr>
                     <td style="padding: 5px 10px;">${index + 1}</td>
                     <td style="padding: 5px 10px;">${item.product.title}</td>
                     <td style="padding: 5px 10px;">${item.amount}</td>
                     <td style="padding: 5px 10px;">${item.quantity}</td>
                     <td style="padding: 5px 10px;">${item.subTotal}</td>
                  </tr>
                  `
               )).join(' ')}
               <tr>
                  <td colspan="3" style="padding: 5px 10px;"><h3>Total</h3></td>
                  <td colspan="2" style="padding: 5px 10px;"><h3>${totalAmount}</h3></td>
               </tr>
            </table>
            <br>
            Best regards,<br>
            Nisisi Team
         </div>
      </div>
      <div style="padding:5px 30px;text-align:center">Take control of your style, we have put the power in your hands; <b>stand out</b> of the cloud</div>
      <div style="text-align:center;padding:10px 25px 35px 25px;color:#878787">
         <div>  &copy;Copyright 20, <b>Nisisi</b> Ltd</div>
      </div>
      <!-- BODY, END -->
 </div>
 `);

export default verifyUserTemplate;
