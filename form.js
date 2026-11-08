"use strict";

// History contains only field identifiers and fixed guidance, never entered values.
const form_errors = [];
const form = document.querySelector("#contact-form");

if (form) {
  const fields = ["name", "email", "comments"].map((id) => document.getElementById(id));
  const labels = { name: "Name", email: "Email", comments: "Comments" };
  const errorArea = document.querySelector("#form-error-area");
  const errorStatus = document.createElement("p");
  errorArea.querySelector("ul").before(errorStatus);
  const infoArea = document.querySelector("#form-info");
  const counter = document.querySelector("#comments-count");
  const comments = document.querySelector("#comments");
  const historyField = document.querySelector("#form-errors");
  const edited = new Set();
  const revealed = new Set();
  const warningThreshold = 100;
  let attempted = false;

  function getError(field) {
    // Always clear a stale custom error before inspecting the native state.
    field.setCustomValidity("");
    let message = "";
    if (field.validity.valueMissing) {
      message = `Enter your ${labels[field.id].toLowerCase()}.`;
    } else if (field.validity.typeMismatch) {
      message = "Enter an email address such as alex@example.com.";
    } else if (field.validity.tooShort ||
      (field.minLength > 0 && field.value.length < field.minLength)) {
      message = `Enter at least ${field.minLength} characters for ${labels[field.id].toLowerCase()}.`;
    } else if (field.validity.tooLong ||
      (field.maxLength >= 0 && field.value.length > field.maxLength)) {
      message = `Use no more than ${field.maxLength} characters for ${labels[field.id].toLowerCase()}.`;
    } else if (!field.validity.valid) {
      message = `Check the ${labels[field.id].toLowerCase()} field.`;
    }
    field.setCustomValidity(message);
    return message;
  }

  function showError(field, message) {
    const item = document.getElementById(`${field.id}-error`);
    item.textContent = message ? `${labels[field.id]}: ${message}` : "";
    item.hidden = !message;
    if (message) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
    const count = fields.filter((control) => control.getAttribute("aria-invalid") === "true").length;
    errorStatus.textContent = count ? `Please correct ${count} ${count === 1 ? "field" : "fields"}.` : "No errors to show.";
  }

  function updateCounter() {
    const remaining = comments.maxLength - comments.value.length;
    const warning = remaining <= warningThreshold;
    infoArea.classList.toggle("length-warning", warning);
    if (remaining === 0) {
      counter.textContent = "0 characters remaining. You have reached the 1,000-character limit. You can still submit your message.";
    } else {
      counter.textContent = `${remaining} characters remaining.${warning ? " You are close to the limit." : ""}`;
    }
  }

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      edited.add(field);
      const message = getError(field);
      if (attempted || revealed.has(field)) showError(field, message);
      if (field === comments) updateCounter();
    });
    field.addEventListener("blur", () => {
      if (edited.has(field) || attempted) {
        revealed.add(field);
        showError(field, getError(field));
      }
    });
  });

  form.addEventListener("submit", (event) => {
    attempted = true;
    const invalidFields = [];
    fields.forEach((field) => {
      const message = getError(field);
      showError(field, message);
      if (message) {
        invalidFields.push(field);
        // Exactly one entry per invalid field in this submission attempt.
        form_errors.push({ field: field.name, message });
      }
    });
    if (invalidFields.length) {
      event.preventDefault();
      // Only submission moves focus; input and blur never do.
      invalidFields[0].focus();
      invalidFields[0].reportValidity();
      return;
    }
    historyField.value = JSON.stringify(form_errors);
    // Let the browser perform its ordinary application/x-www-form-urlencoded POST.
  });

  updateCounter();
  errorStatus.textContent = "No errors to show.";
  errorArea.hidden = false;
  infoArea.hidden = false;
  // Enable our submission handler only after all enhancements are installed.
  // Without JS, HTML constraints and standard browser submission remain active.
  // With JS, both button and Enter submissions reach the same handler before
  // validation, avoiding native invalid events blocking error-history recording.
  form.noValidate = true;
}
