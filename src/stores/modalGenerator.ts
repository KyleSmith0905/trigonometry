import { ref } from 'vue';
import { defineStore } from 'pinia';
import { randomHex } from '@/helpers/string';

export type ModalContents = 'signing' | 'payment' | 'payment-success'

export const useModalGenerator = defineStore('modalGenerator', () => {

  const modals = ref<{id: string, content: string, leaving: boolean}[]>([])

  const openModal = (name: ModalContents) => {
    modals.value.push({id: randomHex(), content: name, leaving: false});
  }
  
  const escapeModal = () => {
    const removalItem = modals.value[modals.value.length - 1];
    removalItem.leaving = true;
    setTimeout(() => {
      modals.value.splice(modals.value.indexOf(removalItem), 1);
    }, 200);
  }

  return {modals, openModal, escapeModal}
})
