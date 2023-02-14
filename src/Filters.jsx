import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  lead,
  contact,
  date,
  text,
  lookup,
  boolean,
  supportedOperator,
} from './data.js';

export const Filters = ({
  eachFilter,
  setEachFilter,
  leadType,
  leads,
  eachf,
  onDeleteFilter,
  onAddFilter,
  localFilter,
  setLocalStateFilter,
}) => {
  const [formData, setFormData] = useState({
    zoho_field: '',

    data_type: '',
    value: '',
    operator: '',
  });

  // console.log(formData);

  const getOperator = (dataTypes) => {
    if (supportedOperator.includes(dataTypes)) {
      switch (dataTypes) {
        case 'date':
        case 'datetime':
        case 'currency':
        case 'number':
          return date;

        case 'text':
        case 'picklist':
          return text;

        case 'lookup':
        case 'ownerlookup':
          return lookup;

        case 'boolean':
          return boolean;
      }
    } else {
      return ['no operator found'];
    }
  };

  // get input fields on the basis of operaotr

  const getInputFields = (operator) => {
    switch (operator) {
      case 'in':
      case 'not in':
      case 'picklist':
        const Select = () => {
          return (
            <select>
              <option>Select here</option>
            </select>
          );
        };

        return <Select />;

      case 'is null':
      case 'is not null':
        return null;

      case 'between':
      case 'not between':
        const RangeDate = () => {
          return (
            <div style={{ display: 'flex' }}>
              <input
                type="date"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    value: {
                      ...prev.value,
                      startDateTime: e.target.value,
                    },
                  }))
                }
                value={formData?.value?.startDateTime}
                name={'s'}
              />{' '}
              <input
                value={formData?.value?.endDateTime}
                type="date"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    value: {
                      ...prev.value,
                      endDateTime: e.target.value,
                    },
                  }))
                }
                name={'E'}
              />
            </div>
          );
        };

        return <RangeDate />;
      default:
        const Input = () => {
          return (
            <input
              placeholder={'type here'}
              value={formData.value}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  value: e.target.value,
                }))
              }
            />
          );
        };

        return <Input />;
    }
  };

  return (
    <div className="filters">
      <div className="each_filter">
        <div>
          <h4>Filter name</h4>
          {/* <input placeholder="filter name" /> */}
          <select
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,

                zoho_field: e.target.value,
                data_type: leads[leadType].find(
                  (f) => f.name === e.target.value
                ).type,
              }));
            }}
          >
            <option>Select here</option>
            {leads[leadType]?.map((e) => (
              <option value={e.name}>{e.label}</option>
            ))}
          </select>
        </div>
        <div>
          <h4>operator name</h4>
          <select
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, operator: e.target.value }))
            }
          >
            <option>Select here</option>
            {Object.values(getOperator(formData.data_type)).map((f) => (
              <option value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          {getInputFields(formData.operator) && <h4>value</h4>}
          {getInputFields(formData.operator)}
        </div>
        <div>
          <button
            onClick={() => {
              onAddFilter(formData);
            }}
            disabled={
              !formData.zoho_field && !formData.id && !formData.data_type
            }
          >
            Save
          </button>
          <button>Cancel</button>
        </div>
      </div>
    </div>
  );
};
