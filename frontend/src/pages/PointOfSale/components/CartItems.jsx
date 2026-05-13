import CartItem from "./CartItem";

const CartItems = ({ cartItems, updateQuantity, removeItem }) => {
  return (
    <div className="space-y-3 max-h-[300px] overflow-auto mt-3">
      {cartItems?.map((cartItem) => (
        <CartItem
          key={cartItem.id}
          cartItem={cartItem}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
        />
        // <div
        //   key={item.id}
        //   className="flex justify-between items-center border-b pb-2"
        // >
        //   <div>
        //     <p className="font-semibold text-purple-700 text-sm">
        //       {item.nameEn}
        //     </p>
        //     <p className="text-xs text-gray-500">
        //       ${item.price} × {item.qty} ={" "}
        //       <b>${(item.price * item.qty).toFixed(2)}</b>
        //     </p>
        //   </div>

        //   {/* Quantity + Delete BEAUTIFUL */}
        //   <div className="flex items-center gap-1">
        //     <button
        //       onClick={() => updateQuantity(item.id, item.qty - 1)}
        //       className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
        //     >
        //       -
        //     </button>

        //     <span className="font-bold w-6 text-center">{item.qty}</span>

        //     <button
        //       onClick={() => updateQty(item.id, item.qty + 1)}
        //       className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
        //     >
        //       +
        //     </button>

        //     <button
        //       onClick={() => removeItem(item.id)}
        //       className="w-7 h-7 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 ml-1"
        //     >
        //       🗑
        //     </button>
        //   </div>
        // </div>
      ))}
    </div>
  );
};
export default CartItems;
