import React from "react";
import { useState, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ValideModal = (props) => {
  const [open, setOpen] = useState(props.open);
  const cancelButtonRef = useRef(null);

  if (open) {
    return (
      <div
        className="bg-green-100 border-l-4 border-green-600 text-green-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span className="block sm:inline"> {props.children}</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
          <button
            type="button"
            className="text-green-900 hover:text-green-700"
            onClick={() => setOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </span>
      </div>
    );
  } else return null;
};

export default ValideModal;
