'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, AddressInput } from '../schemas/customer';
import {
  getAddressesAction,
  createAddressAction,
  updateAddressAction,
  deleteAddressAction,
} from '../actions/customer';
import { MapPin, Plus, Trash2, Edit3, X } from 'lucide-react';
import { toast } from 'sonner';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

interface AddressFormValues {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export function AccountAddressesContainer() {
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingAddressId, setEditingAddressId] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema) as unknown as import('react-hook-form').Resolver<AddressFormValues>,
    defaultValues: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: '',
      isDefaultShipping: false,
      isDefaultBilling: false,
    },
  });

  const loadAddresses = React.useCallback(async () => {
    setIsLoading(true);
    const res = await getAddressesAction();
    if (res.success && res.data) {
      setAddresses(res.data);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const onSubmit = async (data: AddressInput) => {
    if (editingAddressId) {
      const res = await updateAddressAction(editingAddressId, data);
      if (res.success) {
        toast.success('Address updated successfully!');
        setEditingAddressId(null);
        setShowAddForm(false);
        reset();
        loadAddresses();
      } else {
        toast.error(res.error?.message || 'Failed to update address');
      }
    } else {
      const res = await createAddressAction(data);
      if (res.success) {
        toast.success('Address added successfully!');
        setShowAddForm(false);
        reset();
        loadAddresses();
      } else {
        toast.error(res.error?.message || 'Failed to add address');
      }
    }
  };

  const handleEdit = (addr: Address) => {
    setEditingAddressId(addr.id);
    setValue('street', addr.street);
    setValue('city', addr.city);
    setValue('state', addr.state);
    setValue('country', addr.country);
    setValue('zipCode', addr.zipCode);
    setValue('isDefaultShipping', addr.isDefaultShipping);
    setValue('isDefaultBilling', addr.isDefaultBilling);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    const res = await deleteAddressAction(id);
    if (res.success) {
      toast.success('Address deleted successfully!');
      loadAddresses();
    } else {
      toast.error(res.error?.message || 'Failed to delete address');
    }
  };

  if (isLoading) {
    return (
      <div className="border border-white/5 bg-[#0a0a0a] p-8 rounded-xl space-y-6 text-left animate-pulse">
        <div className="h-4 bg-white/5 w-1/4 rounded" />
        <div className="h-12 bg-white/5 w-full rounded" />
        <div className="h-12 bg-white/5 w-full rounded" />
      </div>
    );
  }

  return (
    <div className="border border-white/5 bg-[#0a0a0a] p-6 sm:p-8 rounded-xl space-y-6 text-left text-white">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-white">My Saved Addresses</h3>
          <p className="text-[10px] text-[#B5B5B5] font-light mt-1">Configure your default shipping destinations and checkout billing cards.</p>
        </div>
        <button
          onClick={() => {
            setEditingAddressId(null);
            reset();
            setShowAddForm(!showAddForm);
          }}
          className="bg-white text-black hover:bg-[#0A0A0A] hover:text-white hover:border-[#FF4D00] border border-white py-2.5 px-5 text-[9px] tracking-widest font-black uppercase transition-all flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer rounded-xl"
        >
          {showAddForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          <span>{showAddForm ? 'Cancel' : 'Add New Address'}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-black p-5 border border-white/5 rounded-lg space-y-4 text-xs">
          <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#B5B5B5]">
            {editingAddressId ? 'Edit Address' : 'Add New Address'}
          </h4>
          <div className="space-y-3">
            <div className="space-y-1">
              <input
                type="text"
                placeholder="Street Address"
                {...register('street')}
                className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white rounded outline-none focus:border-[#FF4D00]"
              />
              {errors.street?.message && <span className="text-[9px] text-red-500 block">{errors.street.message as string}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="City"
                  {...register('city')}
                  className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white rounded outline-none focus:border-[#FF4D00]"
                />
                {errors.city?.message && <span className="text-[9px] text-red-500 block">{errors.city.message as string}</span>}
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="State / Province"
                  {...register('state')}
                  className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white rounded outline-none focus:border-[#FF4D00]"
                />
                {errors.state?.message && <span className="text-[9px] text-red-500 block">{errors.state.message as string}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="ZIP / Postal Code"
                  {...register('zipCode')}
                  className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white rounded outline-none focus:border-[#FF4D00]"
                />
                {errors.zipCode?.message && <span className="text-[9px] text-red-500 block">{errors.zipCode.message as string}</span>}
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Country"
                  {...register('country')}
                  className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white rounded outline-none focus:border-[#FF4D00]"
                />
                {errors.country?.message && <span className="text-[9px] text-red-500 block">{errors.country.message as string}</span>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register('isDefaultShipping')} className="h-4 w-4 bg-[#0a0a0a] border-white/10 text-white rounded" />
                <span className="text-[10px] uppercase text-[#B5B5B5]">Set as Default Shipping</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register('isDefaultBilling')} className="h-4 w-4 bg-[#0a0a0a] border-white/10 text-white rounded" />
                <span className="text-[10px] uppercase text-[#B5B5B5]">Set as Default Billing</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black hover:bg-[#0A0A0A] hover:text-white hover:border-[#FF4D00] border border-white py-3 text-[10px] tracking-widest font-black uppercase transition-colors rounded-xl cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingAddressId ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-white/10 rounded-xl text-[#B5B5B5] text-xs">
          No saved addresses found. Add an address to facilitate checkout.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="border border-white/5 bg-black p-5 rounded-xl space-y-4 relative flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2 text-[#FF4D00]">
                    <MapPin className="h-4 w-4" />
                    <span className="text-[9px] uppercase tracking-widest font-bold">Shipping Address</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(addr)}
                      className="text-[#B5B5B5] hover:text-white p-1 transition-colors bg-transparent border-0 cursor-pointer"
                      aria-label="Edit address"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="text-[#B5B5B5] hover:text-red-500 p-1 transition-colors bg-transparent border-0 cursor-pointer"
                      aria-label="Delete address"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs space-y-1 text-[#E5E5E5]">
                  <p className="font-semibold text-white">{addr.street}</p>
                  <p>{addr.city}, {addr.state} - {addr.zipCode}</p>
                  <p>{addr.country}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 pt-3 border-t border-white/5">
                {addr.isDefaultShipping && (
                  <span className="text-[8px] uppercase tracking-widest font-black text-[#FF4D00]">Default Shipping</span>
                )}
                {addr.isDefaultBilling && (
                  <span className="text-[8px] uppercase tracking-widest font-black text-amber-500">Default Billing</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default AccountAddressesContainer;
