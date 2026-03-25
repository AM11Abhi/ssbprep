const INDIAN_STATES = [
  '', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry',
];

const ADDRESS_TYPES = [
  { key: 'maximum', label: 'Maximum Residence' },
  { key: 'present', label: 'Present Residence' },
  { key: 'permanent', label: 'Permanent Residence' },
];

/**
 * Updates a single field inside one address block (maximum/present/permanent).
 */
function AddressBlock({ typeKey, label, data = {}, onChange }) {
  const handleField = (field, value) => {
    onChange(typeKey, { ...data, [field]: value });
  };

  return (
    <div className="piq-sub-section">
      <h3 className="piq-sub-title">{label}</h3>
      <div className="piq-fields-grid">
        <div className="piq-field piq-field--wide">
          <label className="piq-label">Place / Village / Town</label>
          <input
            className="piq-input"
            type="text"
            placeholder="e.g. Sector 15, Noida"
            value={data.place || ''}
            onChange={(e) => handleField('place', e.target.value)}
          />
        </div>

        <div className="piq-field">
          <label className="piq-label">District</label>
          <input
            className="piq-input"
            type="text"
            placeholder="e.g. Gautam Buddh Nagar"
            value={data.district || ''}
            onChange={(e) => handleField('district', e.target.value)}
          />
        </div>

        <div className="piq-field">
          <label className="piq-label">State</label>
          <select
            className="piq-input piq-select"
            value={data.state || ''}
            onChange={(e) => handleField('state', e.target.value)}
          >
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s || 'Select state...'}</option>
            ))}
          </select>
        </div>

        <div className="piq-field">
          <label className="piq-label">Population (approx.)</label>
          <input
            className="piq-input"
            type="text"
            placeholder="e.g. 50000"
            value={data.population || ''}
            onChange={(e) => handleField('population', e.target.value)}
          />
        </div>

        <div className="piq-field piq-field--wide">
          <label className="piq-checkbox-label">
            <input
              type="checkbox"
              className="piq-checkbox"
              checked={data.isDistrictHQ || false}
              onChange={(e) => handleField('isDistrictHQ', e.target.checked)}
            />
            <span>Is District Headquarters</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function AddressSection({ piq, setPiq }) {
  const address = piq.address || {};

  const handleAddressChange = (typeKey, updatedBlock) => {
    setPiq((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [typeKey]: updatedBlock,
      },
    }));
  };

  return (
    <div className="piq-section">
      <h2 className="piq-section-title">Address</h2>
      {ADDRESS_TYPES.map(({ key, label }) => (
        <AddressBlock
          key={key}
          typeKey={key}
          label={label}
          data={address[key] || {}}
          onChange={handleAddressChange}
        />
      ))}
    </div>
  );
}

export default AddressSection;
