import { Component, Show } from 'solid-js';
import { createSignal } from 'solid-js';
import CitySelect from './CitySelect';
import { apiService } from '../services/api-service';

const OngkirForm: Component = () => {
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [shippingCost, setShippingCost] = createSignal<any>(null);
  const [formData, setFormData] = createSignal({
    origin: null as number | null,
    destination: null as number | null,
    weight: null as number | null,
    courier: null as string | null,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!formData().origin || !formData().destination || !formData().weight || !formData().courier) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.calculateShipping(formData());
      setShippingCost(response.rajaongkir.results[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate shipping cost');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      origin: null,
      destination: null,
      weight: null,
      courier: null
    });
    setShippingCost(null);
    setError(null);
  };

  return (
    <div class="container mx-auto p-4">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Shipping Cost Calculator</h2>
          
          <form onSubmit={handleSubmit} class="space-y-4">
            <CitySelect
              label="Origin City"
              value={formData().origin}
              onChange={(value) => updateFormData('origin', value)}
              disabled={loading()}
            />

            <CitySelect
              label="Destination City"
              value={formData().destination}
              onChange={(value) => updateFormData('destination', value)}
              disabled={loading()}
            />

            <div class="form-control">
              <label class="label">
                <span class="label-text">Weight (grams)</span>
              </label>
              <input
                type="number"
                class="input input-bordered"
                value={formData().weight || ''}
                onInput={(e) => updateFormData('weight', parseInt(e.currentTarget.value))}
                disabled={loading()}
                placeholder="Enter weight in grams"
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Courier</span>
              </label>
              <select
                class="select select-bordered"
                value={formData().courier || ''}
                onChange={(e) => updateFormData('courier', e.currentTarget.value)}
                disabled={loading()}
              >
                <option value="">Select courier</option>
                <option value="jne">JNE</option>
                <option value="pos">POS Indonesia</option>
                <option value="tiki">TIKI</option>
              </select>
            </div>

            <div class="card-actions justify-end space-x-2 mt-10">
              <button
                type="button"
                class="btn btn-ghost btn-accent flex items-center space-x-2"
                onClick={resetForm}
                disabled={loading()}
              >
                Reset
              </button>
              <button
                type="submit"
                class="btn btn-primary btn-accent flex items-center"
                disabled={loading()}
              >
                {loading() ? 
                  <div class="loading loading-spinner"></div> : 
                  'Calculate Cost'
                }
              </button>
            </div>
          </form>

          <Show when={error()}>
            <div class="alert alert-error mt-4">
              <span>{error()}</span>
            </div>
          </Show>

          <Show when={shippingCost()}>
            <div class="mt-6">
              <h3 class="text-lg font-semibold mb-2">Shipping Options</h3>
              <div class="overflow-x-auto">
                <table class="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Description</th>
                      <th>Cost</th>
                      <th>ETA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shippingCost()?.costs.map((cost: any) => (
                      <tr>
                        <td>{cost.service}</td>
                        <td>{cost.description}</td>
                        <td>Rp {cost.cost[0].value.toLocaleString()}</td>
                        <td>{cost.cost[0].etd} days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default OngkirForm;