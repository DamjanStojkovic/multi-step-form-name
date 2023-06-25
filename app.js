const steps = document.querySelectorAll(".stp");
const circleSteps = document.querySelectorAll(".step");
const formInputs = document.querySelectorAll(".step-1 form input");
const plans = document.querySelectorAll(".plan");
const switcher = document.querySelector(".switch");
const addons = document.querySelectorAll(".box");
const total = document.querySelector(".total b");
const planPrice = document.querySelector(".plan-price");
const change = document.querySelector(".change");

let time;
let currentStep = 1;
let currentCircle = 0;
const obj = {
  plan: document.querySelector("b"),
  kind: null,
  price: document.querySelector(".price"),
};

steps.forEach((step) => {
  const nextBtn = step.querySelector(".next-step");
  const prevBtn = step.querySelector(".prev-step");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentStep--;
      currentCircle--;
      document.querySelector(`.step-${currentStep + 1}`).style.display = "none";
      document.querySelector(`.step-${currentStep}`).style.display = "flex";
      circleSteps[currentCircle + 1].classList.remove("active");
      circleSteps[currentCircle].classList.add("active");
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (validateForm()) {
        currentStep++;
        currentCircle++;
        document.querySelector(`.step-${currentStep - 1}`).style.display =
          "none";
        document.querySelector(`.step-${currentStep}`).style.display = "flex";
        if (currentCircle <= 3) {
          circleSteps[currentCircle - 1].classList.remove("active");
          circleSteps[currentCircle].classList.add("active");
        }
        setTotal();
        if (currentStep == 3) summary(obj);
      }
    });
  }
});

change.addEventListener("click", () => {
  document.querySelector(`.step-${currentStep}`).style.display = "none";
  circleSteps[currentCircle].classList.remove("active");
  document.querySelector(`.step-${currentStep - 2}`).style.display = "flex";
  circleSteps[currentCircle - 2].classList.add("active");
  currentStep = 2;
  currentCircle = 1;
});

function summary(obj) {
  const planName = document.querySelector(".plan-name");

  planPrice.innerHTML = `${obj.price.innerText}`;
  planName.innerHTML = `${obj.plan.innerText} (${
    obj.kind ? "yearly" : "monthly"
  })`;
}

function validateForm() {
  let valid = true;
  for (let i = 0; i < formInputs.length; i++)
    if (!formInputs[i].value) {
      valid = false;
      formInputs[i].classList.add("err");
      findLabel(formInputs[i]).nextElementSibling.style.display = "flex";
    } else {
      valid = true;
      formInputs[i].classList.remove("err");
      findLabel(formInputs[i]).nextElementSibling.style.display = "none";
    }
  return valid;
}

function findLabel(el) {
  const idVal = el.id;
  const labels = document.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor == idVal) return labels[i];
  }
}

plans.forEach((plan) => {
  plan.addEventListener("click", () => {
    document.querySelector(".selected").classList.remove("selected");
    plan.classList.add("selected");
    const planName = plan.querySelector("b");
    const planPrice = plan.querySelector(".price");
    obj.plan = planName;
    obj.price = planPrice;
  });
});

switcher.addEventListener("click", () => {
  const val = switcher.querySelector("input").checked;
  if (val) {
    document.querySelector(".monthly").classList.remove("sw-active");
    document.querySelector(".yearly").classList.add("sw-active");
    document.querySelectorAll(".free").forEach((element) => {
      element.style.display = "flex";
    });
  } else {
    document.querySelector(".monthly").classList.add("sw-active");
    document.querySelector(".yearly").classList.remove("sw-active");
    document.querySelectorAll(".free").forEach((element) => {
      element.style.display = "none";
    });
  }
  switchPrice(val);
  obj.kind = val;
});

function switchPrice(checked) {
  const yearlyPrice = [90, 120, 150];
  const monthlyPrice = [9, 12, 15];
  const yearlyAdd = [10, 20];
  const monthlyAdd = [1, 2];
  const prices = document.querySelectorAll(".price");
  const pricesAdd = document.querySelectorAll(".price-add");
  if (checked) {
    prices[0].innerHTML = `$${yearlyPrice[0]}/yr`;
    prices[1].innerHTML = `$${yearlyPrice[1]}/yr`;
    prices[2].innerHTML = `$${yearlyPrice[2]}/yr`;
    pricesAdd[0].innerHTML = `$${yearlyAdd[0]}/yr`;
    pricesAdd[1].innerHTML = `$${yearlyAdd[1]}/yr`;
    pricesAdd[2].innerHTML = `$${yearlyAdd[1]}/yr`;
    setTime(true);
  } else {
    prices[0].innerHTML = `$${monthlyPrice[0]}/mo`;
    prices[1].innerHTML = `$${monthlyPrice[1]}/mo`;
    prices[2].innerHTML = `$${monthlyPrice[2]}/mo`;
    pricesAdd[0].innerHTML = `$${monthlyAdd[0]}/mo`;
    pricesAdd[1].innerHTML = `$${monthlyAdd[1]}/mo`;
    pricesAdd[2].innerHTML = `$${monthlyAdd[1]}/mo`;
    setTime(false);
  }
}

addons.forEach((addon) => {
  addon.addEventListener("click", (e) => {
    const addonSelect = addon.querySelector("input");
    const ID = addon.getAttribute("data-id");
    if (addonSelect.checked) {
      addonSelect.checked = false;
      addon.classList.remove("ad-selected");
      showAddon(ID, false);
    } else {
      addonSelect.checked = true;
      addon.classList.add("ad-selected");
      showAddon(addon, true);
      e.preventDefault();
    }
  });
});

function showAddon(ad, val) {
  const temp = document.getElementsByTagName("template")[0];
  const clone = temp.content.cloneNode(true);
  const serviceName = clone.querySelector(".service-name");
  const servicePrice = clone.querySelector(".servic-price");
  const serviceID = clone.querySelector(".selected-addon");
  if (ad && val) {
    serviceName.innerText = ad.querySelector("label").innerText;
    servicePrice.innerText = ad.querySelector(".price-add").innerText;
    serviceID.setAttribute("data-id", ad.dataset.id);
    document.querySelector(".addons").appendChild(clone);
  } else {
    const addons = document.querySelectorAll(".selected-addon");
    addons.forEach((addon) => {
      const attr = addon.getAttribute("data-id");
      if (attr == ad) {
        addon.remove();
      }
    });
  }
}

function setTotal() {
  const str = planPrice.innerHTML;
  const res = str.replace(/\D/g, "");
  const addonPrices = document.querySelectorAll(
    ".selected-addon .servic-price"
  );

  let val = 0;
  for (let i = 0; i < addonPrices.length; i++) {
    const str = addonPrices[i].innerHTML;
    const res = str.replace(/\D/g, "");

    val += Number(res);
  }
  total.innerHTML = `$${val + Number(res)}/${time ? "yr" : "mo"}`;
}
function setTime(t) {
  return (time = t);
}
