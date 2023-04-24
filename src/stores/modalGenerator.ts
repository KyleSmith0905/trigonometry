import { ref } from 'vue';
import { defineStore } from 'pinia';

export type ModalContents = 'signing' | 'payment' | 'payment-success'

export const useModalGenerator = defineStore('modalGenerator', () => {

  const modals = ref<{content: string}[]>([])

  const openModal = (name: ModalContents) => {
    modals.value.push({content: name});
  }
  
  const escapeModal = () => {
    modals.value.pop();
  }

  return {modals, openModal, escapeModal}
})
