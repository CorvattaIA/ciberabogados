import React from 'react';
import Button from '../common/Button'; // Assuming Button.jsx is in src/components/common
import { UserGroupIcon, DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const ActionPanel = ({ onActionRequest }) => {
  return (
    <div className="p-4 bg-light border-t border-gray-200">
      <h3 className="text-sm font-semibold text-secondary mb-3 text-center">Acciones Rápidas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onActionRequest('request_human_consult')}
          className="w-full flex items-center justify-center"
        >
          <UserGroupIcon className="h-5 w-5 mr-2" />
          Asesoría Humana
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onActionRequest('generate_documents')}
          className="w-full flex items-center justify-center"
        >
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          Generar Documentos
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onActionRequest('export_chat')}
          className="w-full flex items-center justify-center"
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          Exportar Chat
        </Button>
      </div>
    </div>
  );
};

export default ActionPanel;
