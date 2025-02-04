"use client"

import * as React from "react"
import { motion, MotionConfig } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "../ThemeToggle"
import { Heart } from "lucide-react"
import HelpDialog from "../HelpDialog"
import Link from "next/link"

const transition = {
  type: "spring",
  bounce: 0.1,
  duration: 0.2,
}

interface SearchToolbarProps {
  placeholder?: string
  onSearch?: (value: string) => void
  onClear?: () => void
  searchIcon: React.ReactNode
  backIcon: React.ReactNode
}

export function SearchToolbar({
  placeholder = "Search...",
  onSearch,
  onClear,
  searchIcon,
  backIcon,
}: SearchToolbarProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isHelpOpen, setIsHelpOpen] = React.useState(false);

  const handleClose = React.useCallback(() => {
    setIsOpen(false)
    setInputValue("")
    onClear?.()
  }, [onClear])

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    onSearch?.(value)
  }, [onSearch])

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [handleClose])

  return (
    <MotionConfig transition={transition}>
      <motion.div
        animate={{
          width: isOpen ? "400px" : "100%",
        }}
        initial={false}
      >
        {!isOpen ? (
          <div className="flex items-center justify-between flex-row pt-2">
            <div className="flex-shrink-0">
              <Link href="/" aria-label="Go to home page">
                <h1 className="text-lg font-bold leading-tight">ReasonsWhy</h1>
              </Link>
            </div>

            <div className="flex items-center flex-row">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setIsOpen(true)}
              >
                {searchIcon}
              </Button>
              <ThemeToggle />
              <Button
                        aria-label="Need Help"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsHelpOpen(true)}
                        className="text-sm font-medium gap-2"
                    >
                        <Heart className="text-red-500  h-[1.2rem] w-[1.2rem] transition-all" />
                        <span className="text-xs">Need Help?</span>
                    </Button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-3 max-w-7xl pt-2 -ml-4 mr-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 flex-shrink-0"
              onClick={handleClose}
            >
              {backIcon}
            </Button>
            <div className="relative flex-1">
              <Input
                className="h-11 text-base px-4 rounded-xl"
                autoFocus
                placeholder={placeholder}
                value={inputValue}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      </motion.div>
      <HelpDialog
        open={isHelpOpen}
        onOpenChange={setIsHelpOpen}
      />
    </MotionConfig>
  )
}