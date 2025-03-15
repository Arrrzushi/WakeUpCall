import { useState, useEffect } from 'react';

export interface Contact {
  name: string;
  tel: string;
}

export async function requestContactsPermission(): Promise<boolean> {
  if (!('contacts' in navigator && 'ContactsManager' in window)) {
    return false;
  }

  try {
    const permission = await (navigator as any).contacts.getProperties();
    return permission.length > 0;
  } catch (e) {
    console.error('Contacts API not supported:', e);
    return false;
  }
}

export async function getContacts(): Promise<Contact[]> {
  if (!('contacts' in navigator)) {
    return [];
  }

  try {
    const properties = ['name', 'tel'];
    const contacts = await (navigator as any).contacts.select(properties);
    return contacts.map((contact: any) => ({
      name: contact.name[0] || 'Unknown',
      tel: contact.tel[0] || '',
    }));
  } catch (e) {
    console.error('Error accessing contacts:', e);
    return [];
  }
}
