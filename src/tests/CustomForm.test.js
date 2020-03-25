import React from "react";
import ReactTestUtils, { act } from "react-dom/test-utils";
import { createContainer } from "./domManipulators";
import { CustomForm } from "../components/CutomForm";

describe("Custom form", () => {
  const originalFetch = window.fetch;
  let render, container, fetchSpy;

  const spy = () => {
    let receivedArgument, returnValue;
    return {
      fn: (...args) => {
        receivedArgument = args;
        return returnValue;
      },
      receivedArguments: () => receivedArgument,
      receivedArgument: n => receivedArgument[n],
      stubReturnValue: value => (returnValue = value)
    };
  };

  const fetchResponseOk = body =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(body)
    });

  const fetchRequestBody = () => JSON.parse(fetchSpy.mock.calls[0][1].body);

  const fetchResponseError = () => Promise.resolve({ ok: false });

  // expect.extend({
  //   toHaveBeenCalled(received) {
  //     if (received.receivedArguments() === undefined) {
  //       return {
  //         pass: false,
  //         message: () => "Spy was not called"
  //       };
  //     }
  //     return { pass: true, message: () => "Spy was called" };
  //   }
  // });

  beforeEach(() => {
    ({ render, container } = createContainer());
    fetchSpy = jest.fn(() => fetchResponseOk({}));
    window.fetch = fetchSpy;
    // fetchSpy.stubReturnValue(fetchResponseOk({}));
  });

  afterEach(() => {
    window.fetch = originalFetch;
  });

  const form = id => container.querySelector(`form[id=${id}]`);
  const field = name => form("customer").elements[name];

  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual("INPUT");
    expect(formElement.type).toEqual("text");
  };

  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}"]`);

  const itRendersATextBox = fieldName => {
    it("renders as a text box", () => {
      render(<CustomForm />);
      expectToBeInputFieldOfTypeText(field(fieldName));
    });
  };

  const itIncludesTheExistingValue = fieldName => {
    it("includes the existing value ", () => {
      render(<CustomForm {...{ [fieldName]: "value" }} />);
      expect(field(fieldName).value).toEqual("value");
    });
  };

  const itRendersALabel = (fieldName, labelName) => {
    it("renders a label ", () => {
      render(<CustomForm />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(labelName);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = label => {
    it("assigns an id that matches the label id ", () => {
      render(<CustomForm />);
      expect(field(label).id).toEqual(label);
    });
  };

  const itSavesExistingValueWhenSubmited = fieldName => {
    it("saves existing value when submited", async () => {
      render(<CustomForm {...{ [fieldName]: "value" }} fetch={fetchSpy.fn} />);

      ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value: "value", name: fieldName }
      });
      ReactTestUtils.Simulate.submit(form("customer"));
      expect(fetchRequestBody()).toMatchObject({ [fieldName]: "value" });
    });
  };

  const itSavesNewValueWhenSubmited = (fieldName, formId, value) => {
    it("saves new value when submited", async () => {
      render(
        <CustomForm
          {...{ [fieldName]: "existing-value" }}
          fetch={fetchSpy.fn}
        />
      );
      ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value: value, name: fieldName }
      });
      ReactTestUtils.Simulate.submit(form(formId));
      expect(fetchRequestBody()).toMatchObject({ [fieldName]: value });
    });
  };

  const itHasASubmitButton = () => {
    it("has a submit button", () => {
      render(<CustomForm />);
      const submitButton = container.querySelector('input[type="submit"]');
      expect(submitButton).not.toBeNull();
    });
  };

  const itCallsFetchWithRightProperties = () => {
    it("calls fetch with the right properties when submitting data", async () => {
      render(<CustomForm />);
      ReactTestUtils.Simulate.submit(form("customer"));
      expect(fetchSpy).toHaveBeenCalledWith(
        "/customers",
        expect.objectContaining({
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json"
          }
        })
      );
    });
  };

  const itNotifiesOnSaveWhenSubmitted = () => {
    it("notifies on save when form is submitted", async () => {
      const customer = { id: 123 };
      fetchSpy.mockReturnValue(fetchResponseOk(customer));
      const saveSpy = jest.fn();
      render(<CustomForm onSave={saveSpy} />);
      await act(async () => {
        ReactTestUtils.Simulate.submit(form("customer"));
      });
      expect(saveSpy).toHaveBeenCalledWith(customer);
    });
  };

  const itDoesNotNotifiyOnSaveOnError = () => {
    it("does not notify on save if the response return an error", async () => {
      fetchSpy.mockReturnValue(fetchResponseError());
      const saveSpy = jest.fn();
      render(<CustomForm onSave={saveSpy} />);
      await act(async () => {
        ReactTestUtils.Simulate.submit(form("customer"));
      });
      expect(saveSpy).not.toHaveBeenCalled();
    });
  };

  const itPreventsDefault = () => {
    it("prevents the default action when submitting the form ", async () => {
      const preventsDefaultSpy = jest.fn();
      render(<CustomForm />);
      await act(async () => {
        ReactTestUtils.Simulate.submit(form("customer"), {
          preventDefault: preventsDefaultSpy
        });
      });
      expect(preventsDefaultSpy).toHaveBeenCalled();
    });
  };

  const itRendersErrosMessage = () => {
    it("renders error message when call fails", async () => {
      fetchSpy.mockReturnValue(Promise.resolve({ ok: false }));
      render(<CustomForm />);
      await act(async () => {
        ReactTestUtils.Simulate.submit(form("customer"));
      });
      const errorElement = container.querySelector(".error");
      expect(errorElement).not.toBeNull();
      expect(errorElement.textContent).toMatch("error occurred");
    });
  };

  describe("first name field", () => {
    itRendersATextBox("firstName");
    itIncludesTheExistingValue("firstName");
    itRendersALabel("firstName", "First name");
    itAssignsAnIdThatMatchesTheLabelId("firstName");
    itSavesExistingValueWhenSubmited("firstName");
    itSavesNewValueWhenSubmited("firstName", "customer", "Jamie");
  });

  describe("last name field", () => {
    itRendersATextBox("lastName");
    itIncludesTheExistingValue("lastName");
    itRendersALabel("lastName", "Last name");
    itAssignsAnIdThatMatchesTheLabelId("lastName");
    itSavesExistingValueWhenSubmited("lastName");
    itSavesNewValueWhenSubmited("lastName", "customer", "Jamie");
  });

  describe("last phone field", () => {
    itRendersATextBox("phoneNumber");
    itIncludesTheExistingValue("phoneNumber");
    itRendersALabel("phoneNumber", "Phone number");
    itAssignsAnIdThatMatchesTheLabelId("phoneNumber");
    itSavesExistingValueWhenSubmited("phoneNumber");
    itSavesNewValueWhenSubmited("phoneNumber", "customer", "048543");
  });

  describe("submit button", () => {
    itHasASubmitButton();
  });

  describe("fetch actions", () => {
    itCallsFetchWithRightProperties();
    itNotifiesOnSaveWhenSubmitted();
    itDoesNotNotifiyOnSaveOnError();
    itPreventsDefault();
    itRendersErrosMessage();
  });
});
