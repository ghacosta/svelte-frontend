import { render, screen } from "@testing-library/svelte";
import Input from "./Input.svelte";

it("has is-invalid class for input when help is set", () => {
  const { container } = render(Input, { help: "Error Message" });
  const input = container.querySelector("input");
  expect(input.classList).toContain("is-invalid");
});

it("has invalid-feedback class for span when help is set", () => {
  const { container } = render(Input, { help: "Error Message" });
  const input = container.querySelector("span");
  expect(input.classList).toContain("invalid-feedback");
});

it("does not have is-invalid class for input when help is not set", () => {
  const { container } = render(Input);
  const input = container.querySelector("input");
  expect(input.classList).not.toContain("is-invalid");
});

it("does not display validation error initially", () => {
  const { container } = render(Input);
  const validationAlert = screen.queryByRole("alert");
  expect(validationAlert).not.toBeInTheDocument();
});


