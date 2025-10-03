import AppProviders from './components/AppProviders';
import AppLayout from './components/AppLayout';
import { useNavigation } from './hooks/useNavigation';

export default function App() {
  const navigation = useNavigation();

  return (
    <AppProviders>
      <AppLayout {...navigation} />
    </AppProviders>
  );
}