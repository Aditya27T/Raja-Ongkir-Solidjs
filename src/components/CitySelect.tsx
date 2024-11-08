import { Component, Show } from 'solid-js';
import useCity from '../hooks/useCity';

interface CitySelectProps {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const CitySelect: Component<CitySelectProps> = (props) => {
  const { city, loading, error } = useCity();

  return (
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">{props.label}</span>
      </label>
      <Show
        when={!loading()}
        fallback={<div class="loading loading-spinner loading-md"></div>}
      >
        <Show when={!error()} fallback={<div class="text-error">Error loading cities</div>}>
          <select
            class="select select-bordered w-full"
            value={props.value || ''}
            onChange={(e) => props.onChange(parseInt(e.currentTarget.value))}
            disabled={props.disabled || loading()}
          >
            <option value="">Select city</option>
            {city()?.map((item: any) => (
              <option value={item.city_id}>
                {item.city_name} ({item.province})
              </option>
            ))}
          </select>
        </Show>
      </Show>
    </div>
  );
};

export default CitySelect;