import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './style.css';
import {
  lead,
  contact,
  date,
  text,
  lookup,
  boolean,
  supportedOperator,
} from './data.js';
import { Filters } from './Filters.jsx';

export default function App() {
  const [leadType, setLeadType] = useState('');
  const [leads, setLead] = useState({ lead: [], contact: [] });
  const [dataTypes, setDataTypes] = useState([]);
  const [filter, setFilter] = useState([]);
  const [f, setF] = useState({ lead: [], contact: [] });
  const [eachFilter, setEachFilter] = useState({ lead: [], contact: [] });
  const [createdFilter, setCreatedFilter] = useState({ lead: [], contact: [] });

  const [localFilter, setLocalStateFilter] = useState({
    lead: [],
    contact: [],
  });

  useEffect(() => {
    setLeadType('lead');
    setLead({ lead: lead, contact: contact });
  }, []);

  useEffect(() => {
    const leadDataType = [...new Set(leads.lead?.map((f) => f.type))];
    const contactDataType = [...new Set(leads.contact?.map((f) => f.type))];
    setDataTypes([...new Set([...leadDataType, ...contactDataType])]);
  }, [leads]);

  console.log(typeof {});

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

  let id = 0;

  const onAddFilter = (formData, id) => {
    setCreatedFilter((prev) => ({
      ...prev,
      [leadType]: [...prev[leadType], { ...formData, id: uuidv4() }],
    }));

    const hh = eachFilter[leadType].filter((f) => f.filterId !== id);

    setEachFilter((prev) => ({ ...prev, [leadType]: [...hh] }));
  };

  console.log(createdFilter);

  const onDeleteFilter = () => {};

  return (
    <div className="g-parent">
      <div className="parent">
        <div>
          <lable>
            {' '}
            <input
              type="radio"
              name="lead_type"
              value={'lead'}
              checked={leadType === 'lead'}
              onChange={(e) => setLeadType(e.target.value)}
            />{' '}
            Lead
          </lable>
          <lable>
            {' '}
            <input
              type="radio"
              name="lead_type"
              value={'contact'}
              checked={leadType === 'contact'}
              onChange={(e) => setLeadType(e.target.value)}
            />{' '}
            Contact
          </lable>
        </div>
        <div>
          <select
            name="field"
            onChange={(e) => {
              return setF((prev) => ({
                ...prev,
                [leadType]: [
                  ...prev[leadType],
                  {
                    id: '',
                    zoho_field: e.target.value,
                    value: '',
                    operator: '',
                  },
                ].map((f, i) =>
                  leads[leadType].some((g) => g.name === f.zoho_field)
                    ? {
                        ...f,
                        id: i,
                        zoho_field: leads[leadType].find(
                          (g) => g.name === f.zoho_field
                        ).label,
                        dataTypes: leads[leadType].find(
                          (g) => g.name === f.zoho_field
                        ).type,
                      }
                    : f
                ),
              }));
            }}
          >
            {leads[leadType]?.map((e) => (
              <option value={e.name}>{e.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card_wrapper">
        {f[leadType]?.map((zf) => {
          return (
            <div className="field_card">
              <p>{zf.zoho_field}</p>

              <div>
                <select
                  onChange={(e) =>
                    setF((prev) => ({
                      ...prev,
                      [leadType]: [...prev[leadType]].map((ff) =>
                        ff.zoho_field === zf.zoho_field
                          ? { ...ff, operator: e.target.value }
                          : ff
                      ),
                    }))
                  }
                >
                  {Object?.values(getOperator(zf.dataTypes))?.map((f) => (
                    <option value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {createdFilter[leadType]?.map((f) => {
        console.log(f.value);
        return (
          <div className="created_filter">
            <div className="header">
              {' '}
              <p>
                {leads[leadType]?.find((ff) => ff.name === f.zoho_field)?.label}
              </p>
              <button>X</button>
            </div>
            <div>
              {f.operator} ||{' '}
              {typeof f.value === 'object' &&
                `${f.value.endDateTime}-${f.value.startDateTime}`}
              {typeof f.value === 'string' && f.value}
            </div>
          </div>
        );
      })}

      {eachFilter[leadType]?.map((eachf) => (
        <Filters
          eachFilter={eachFilter}
          setEachFilter={setEachFilter}
          leadType={leadType}
          leads={leads}
          eachf={eachf}
          getOperator={getOperator}
          onAddFilter={onAddFilter}
          onDeleteFilter={onDeleteFilter}
          localFilter={localFilter}
          setLocalStateFilter={setLocalStateFilter}
        />
      ))}

      <button
        onClick={() => {
          setEachFilter((prev) => ({
            ...prev,
            [leadType]: [...prev[leadType], { filterId: uuidv4() }],
          }));
        }}
      >
        Add Filter
      </button>
    </div>
  );
}

// {
//   id: '',
//   zoho_field: e.target.value,
//   value: '',
// },
