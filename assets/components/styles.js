import { css } from 'https://cdn.jsdelivr.net/npm/lit@2/+esm'

export const sharedStyles = css`
     /* 
     trying to keep consistent with: https://getbootstrap.com/docs/5.0/utilities/spacing/#margin-and-padding
     */  
     .mt-3 {
          margin-top: 1rem;
     }
   .mb-2 {
        margin-bottom: 0.5rem;
   }
   .mb-3 {
        margin-bottom: 1rem;
   }
   .fw {
        width: 100%;
   }
   
   .flex-center {
     display: flex;
     align-items: center;
     justify-content: center;
   }
   .gap-10 {
        gap: 10px;
   }
   .wrap {
     flex-wrap: wrap;
   }
   .text-center {
     text-align: center;
   }
   .error {
        color: red;
   }
   /*   
     .column {
     display: flex;
     flex-direction: column;
   }
   */
`