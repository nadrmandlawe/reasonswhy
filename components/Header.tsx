'use client';

import {  Search, X } from 'lucide-react';
import {  usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import HelpDialog from '@/components/HelpDialog';
import debounce from 'lodash.debounce';
import { SearchToolbar } from './ui/toolbar-expandable';

export function Header() {
    const pathname = usePathname();
    const isWallPage = pathname === '/wall';
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || "";
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    useEffect(() => {
        const queryParam = new URLSearchParams(window.location.search).get('q') || "";
        if (queryParam !== searchQuery) {
            setSearchQuery(queryParam);
        }
    }, [searchQuery]);

    const debouncedUpdateUrl = debounce((query: string) => {
        const params = new URLSearchParams(window.location.search);
        if (query.trim()) {
            params.set('q', query.trim());
        } else {
            params.delete('q');
        }
        window.history.replaceState({}, '', `?${params.toString()}`);
    }, 500);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        debouncedUpdateUrl(value);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        debouncedUpdateUrl("");
    };



    return (
        
        <header className="sticky top-0 left-0 right-0 z-10 flex items-center justify-end w-screen px-6 py-3 bg-background/80 backdrop-blur-md">

        {/* Center Section: Search Toolbar (if applicable) */}
        {isWallPage ? (
          <SearchToolbar
            placeholder="Search reasons..."
            onSearch={handleSearch}
            onClear={handleClearSearch}
            searchIcon={<Search className="w-5 h-5" />}
            backIcon={<X className="w-5 h-5" />}
          />
        ) : (
                  
        <div className="flex items-center">
        <Button
          aria-label="Need Help"
          variant="ghost"
          size="sm"
          onClick={() => setIsHelpOpen(true)}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Heart className="w-5 h-5 text-red-500 transition-all" />
          <span className="text-sm">Need Help?</span>
        </Button>
    
        <ThemeToggle />
      </div>
        )}
      

      
        {/* Help Dialog */}
        <HelpDialog open={isHelpOpen} onOpenChange={setIsHelpOpen} />
      </header>
      
    );
}