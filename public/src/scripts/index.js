console.log(">> main");

// Import all of Bootstrap's JS
import { Popover, Dropdown } from "bootstrap";

// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]').forEach((popover) => {
	new Popover(popover);
});

// Create an example dropdown
document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach((dropdownToggleEl) => {
	new Dropdown(dropdownToggleEl);
});
