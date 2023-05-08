var bill = {
  // (A) PROPERTIES
  // (A1) COMMON ITEMS
  items : {
    "Tomato Soup" : 30, "Corn Soup" : 35, "Veggie Soup" : 35,"Mushroom soup" : 30, "Kebab" : 55,
    "Samosa" : 20, "Vada" : 20,"Idli" : 35,"Dosa" : 40, "Chappathi" : 40,"Poori" : 55,"Pongal" :55,
    "Parotta" :50, "Upma" :30,"Idiyappam":55,"South Indian":75,"North Indian": 70,"Veg Biriyani" :85,
    "Chicken Biriyani" :95,"Mutton Biriyani" :135,"Fried Rice":80,"Pasta":70,"Noodles":75,
    "Pizza":75,"Burger" : 125,"Fruit Salad": 50,"Ice-Cream" : 35,"Halwa":35,"Chocolate":25,
    "Milkshake":45,"Juice":35
  },

  // (A2) HTML ELEMENTS
  hAdd : null, // add item button
  hItems : null, // current items
  hList : null, // datalist
  hRow : null, // item row template
  hTotal : null, // total amount
  hPrint : null, // print button

  // (B) INITIALIZE BILLING
  init : () => {
    // (B1) GET HTML ELEMENTS
    bill.hAdd = document.getElementById("billAdd");
    bill.hItems = document.getElementById("billItems");
    bill.hList = document.getElementById("itemList");
    bill.hRow = document.getElementById("itemRow").content;
    bill.hTotal = document.getElementById("billTotalAmt");
    bill.hPrint = document.getElementById("billPrint");

    // (B2) ADD COMMON ITEMS TO DATA LIST
    for (let k of Object.keys(bill.items)) {
      let o = document.createElement("option");
      o.innerHTML = k;
      bill.hList.appendChild(o);
    }

    // (B3) "ACTIVATE" ADD ITEM & PRINT BUTTONS
    bill.hAdd.onclick = bill.add;
    bill.hPrint.onclick = bill.print;
  },

  // (C) ADD AN ITEM
  add : () => {
    // (C1) CLONE ITEM ROW TEMPLATE & APPEND TO TOP
    bill.hItems.insertBefore(bill.hRow.cloneNode(true), bill.hItems.firstChild);
    let row = bill.hItems.querySelector(".row"),
        qty = row.querySelector(".qty"),
        item = row.querySelector(".item"),
        price = row.querySelector(".price"),
        del = row.querySelector(".del");

    // (C2) ATTACH EVENT LISTENERS
    qty.onchange = bill.total;
    item.onchange = () => { if (bill.items[item.value]) {
      price.value = bill.items[item.value];
      bill.total();
    }};
    price.onchange = bill.total;
    del.onclick = () => bill.del(row);
  },

  // (D) DELETE AN ITEM
  del : row => {
    row.remove();
    bill.total();
  },

  // (E) CALCULATE TOTAL
  total : () => {
    // (E1) GET ALL ITEM ROWS
    let all = bill.hItems.querySelectorAll(".row");

    // (E2) EMPTY
    if (all.length==0) {
      bill.hTotal.innerHTML = 0;
      bill.hPrint.disabled = true;
    } else {
      let total = 0;
      for (let r of all) {
        let qty = +r.querySelector(".qty").value,
            price = +r.querySelector(".price").value;
        total += qty * price;
      }
      bill.hTotal.innerHTML = `Rs.${total.toFixed(2)}`;
      bill.hPrint.disabled = false;
    }
  },

  // (F) PRINT
  print : () => {
    // (F1) OPEN NEW "PRINT WINDOW"
    let pwin = window.open("3-bill-print.html");
    pwin.onload = () => {
      // (F2) DUPLICATE ITEMS - REMOVE DELETE ITEM BUTTON
      let clone = bill.hItems.cloneNode(true);
      for (let e of clone.querySelectorAll(".del")) {
        e.remove();
      }
      for (let e of clone.querySelectorAll("input")) {
        e.disabled = true;
      }
      pwin.document.body.appendChild(clone);

      // (F3) DUPLICATE TOTALS
      clone = document.getElementById("billTotal").cloneNode(true);
      clone.querySelector("#billPrint").remove();
      pwin.document.body.appendChild(clone);

      // (F4) PRINT
      pwin.print();
    };
  }
};
window.addEventListener("load", bill.init);