import ReactDOM from "react-dom";

export const createContainer = () => {
  const container = document.createElement("div");
  return {
    render: component => ReactDOM.render(component, container),
    container
  };
};

// describe("test", () => {
//   it("should", () => {
//     const container = document.createElement("div");
//     expect(container).not.toBeNull();
//   });
// });
