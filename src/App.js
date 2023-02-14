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

export default function App() {
  const [leadType, setLeadType] = useState('');

  const [leads, setLead] = useState({ lead: [], contact: [] });
  const [dataTypes, setDataTypes] = useState([]);

  const [filter, setFilter] = useState([]);

  const [f, setF] = useState({ lead: [], contact: [] });

  console.log(f);

  const [eachFilter, setEachFilter] = useState({ lead: [], contact: [] });

  useEffect(() => {
    setLeadType('lead');
    setLead({ lead: lead, contact: contact });
  }, []);

  useEffect(() => {
    const leadDataType = [...new Set(leads.lead?.map((f) => f.type))];
    const contactDataType = [...new Set(leads.contact?.map((f) => f.type))];
    setDataTypes([...new Set([...leadDataType, ...contactDataType])]);
  }, [leads]);

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

  console.log(leads[leadType]);

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

      <div className="filters">
        <div className="each_filter">
          <div>
            <h4>Filter name</h4>
            <input placeholder="filter name" />
          </div>
          <div>
            <h4>operator name</h4>
            <input placeholder="operator name" />
          </div>
          <div>
            <h4>value</h4>
            <input placeholder="enter value" />
          </div>
        </div>

        <button>Add Filter</button>
      </div>
    </div>
  );
}

// {
//   id: '',
//   zoho_field: e.target.value,
//   value: '',
// },
