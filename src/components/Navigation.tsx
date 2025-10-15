import { BarChart3, List, User } from "lucide-react";
import { Button } from "./ui/button";

interface NavigationProps {
  currentView: 'dashboard' | 'listing' | 'profile';
  onViewChange: (view: 'dashboard' | 'listing' | 'profile') => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <div className="flex justify-center gap-4 py-3 bg-yellow-50 border-b border-amber-200">
      <div className="flex gap-2">
        <Button
          onClick={() => onViewChange('dashboard')}
          variant={currentView === 'dashboard' ? 'default' : 'outline'}
          className={`w-12 h-12 rounded-full p-0 ${
            currentView === 'dashboard' 
              ? 'bg-amber-700 hover:bg-amber-800 text-white' 
              : 'border-amber-700 text-amber-700 hover:bg-amber-50'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => onViewChange('listing')}
          variant={currentView === 'listing' ? 'default' : 'outline'}
          className={`w-12 h-12 rounded-full p-0 ${
            currentView === 'listing' 
              ? 'bg-amber-700 hover:bg-amber-800 text-white' 
              : 'border-amber-700 text-amber-700 hover:bg-amber-50'
          }`}
        >
          <List className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => onViewChange('profile')}
          variant={currentView === 'profile' ? 'default' : 'outline'}
          className={`w-12 h-12 rounded-full p-0 ${
            currentView === 'profile' 
              ? 'bg-amber-700 hover:bg-amber-800 text-white' 
              : 'border-amber-700 text-amber-700 hover:bg-amber-50'
          }`}
        >
          <User className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}