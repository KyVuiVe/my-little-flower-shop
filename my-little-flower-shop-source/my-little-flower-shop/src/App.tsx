import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { FlowerShop } from './components/FlowerShop';
import { GiftReceiver } from './components/GiftReceiver';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FlowerShop />} />
        <Route path="/gift/:giftId" element={<GiftReceiver />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
