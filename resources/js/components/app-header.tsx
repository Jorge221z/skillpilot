"use client"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { Icon } from "@/components/icon"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UserMenuContent } from "@/components/user-menu-content"
import { useInitials } from "@/hooks/use-initials"
import { useAppearance } from "@/hooks/use-appearance"
import { cn } from "@/lib/utils"
import type { BreadcrumbItem, NavItem, SharedData } from "@/types"
import { Link, usePage } from "@inertiajs/react"
import { LayoutGrid, Menu, User, MessageCircle, ExternalLink, Info, Sun, Moon } from "lucide-react"
import AppLogo from "./app-logo"
import AppLogoIcon from "./app-logo-icon"

// Añadir imports necesarios para las animaciones
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"

const mainNavItems: NavItem[] = [
  {
    title: "Ofertas",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Chatbot",
    href: "/chatbot",
    icon: MessageCircle,
  },
  {
    title: "Perfil",
    href: "/profile",
    icon: User,
  },
]

const rightNavItems: NavItem[] = [
  {
    title: "Sobre el Proyecto",
    href: "/about",
    icon: Info,
    external: false,
  },
  {
    title: "Mi Portfolio",
    href: "https://jorgemunoz.pro",
    icon: ExternalLink,
    external: true,
  },
]

const activeItemStyles = "text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"

interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItem[]
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
  const page = usePage<SharedData>()
  const { auth } = page.props
  const getInitials = useInitials()
  const { appearance, updateAppearance } = useAppearance()

  // Track the currently selected nav item
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  // Store refs to all nav items for measuring positions
  const navItemRefs = useRef<Map<string, HTMLElement | null>>(new Map())
  // Track hover state for each item
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Initialize the selected item based on the current URL
  useEffect(() => {
    const currentItem = mainNavItems.find((item) => item.href === page.url)
    if (currentItem) {
      setSelectedItem(currentItem.href)
    }
  }, [page.url])

  // Get the dimensions and position of the selected nav item
  const getSelectedItemDimensions = () => {
    if (!selectedItem || !navItemRefs.current.has(selectedItem)) {
      return { width: 0, height: 0, left: 0, top: 0 }
    }

    const element = navItemRefs.current.get(selectedItem)
    if (!element) return { width: 0, height: 0, left: 0, top: 0 }

    const rect = element.getBoundingClientRect()
    const parentRect = element.parentElement?.getBoundingClientRect() || { left: 0, top: 0 }

    return {
      width: rect.width,
      height: rect.height,
      left: rect.left - parentRect.left,
      top: rect.top - parentRect.top,
    }
  }

  // Handle nav item click
  const handleNavItemClick = (href: string) => {
    if (href === selectedItem) return
    setSelectedItem(href)
  }

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = appearance === 'dark' ? 'light' : 'dark'
    updateAppearance(newTheme)
  }

  return (
    <>
      {/* Modificar el estilo del contenedor principal */}
      <div className="border-b border-sidebar-border/80 bg-white dark:bg-neutral-900">
        <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                {/* Modificar el botón del menú móvil para mejorar su apariencia */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 h-[34px] w-[34px] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              {/* Mejorar el SheetContent para el menú móvil */}
              <SheetContent
                side="left"
                className="flex h-full w-64 flex-col items-stretch justify-between bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetHeader className="flex justify-start text-left">
                  <AppLogoIcon className="h-12 w-12" />
                </SheetHeader>
                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                  <div className="flex h-full flex-col justify-between text-sm">
                    <div className="flex flex-col space-y-4">
                      {mainNavItems.map((item) => (
                        // Mejorar los estilos de los enlaces en el menú móvil
                        <Link
                          key={item.title}
                          href={item.href}
                          className="flex items-center space-x-2 font-medium py-2 px-3 rounded-md text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                        >
                          {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                          <span>{item.title}</span>
                        </Link>
                      ))}
                    </div>

                    <div className="flex flex-col space-y-4">
                      {rightNavItems.map((item) =>
                        item.external ? (
                          // Mejorar los estilos de los enlaces externos en el menú móvil
                          <a
                            key={item.title}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200"
                          >
                            {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                            <span>{item.title}</span>
                          </a>
                        ) : (
                          <Link
                            key={item.title}
                            href={item.href}
                            className="flex items-center space-x-2 font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200"
                          >
                            {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                            <span>{item.title}</span>
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Modificar el estilo del logo y el enlace */}
          <Link href="/dashboard" prefetch className="flex items-center space-x-2 group">
            <AppLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="ml-14 hidden h-full items-center space-x-6 lg:flex">
            <div className="relative flex items-center gap-2">
              {/* Animated background indicator */}
              {selectedItem && (
                <motion.div
                  className="absolute rounded-md z-0"
                  layoutId="desktop-nav-indicator"
                  initial={false}
                  animate={getSelectedItemDimensions()}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                >
                  <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
                  <div className="absolute inset-0 border border-blue-200 dark:border-blue-800 rounded-md" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-blue-100/30 to-blue-50/50 dark:from-blue-900/20 dark:via-blue-800/10 dark:to-blue-900/20 rounded-md" />

                  {/* Underline */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 dark:from-blue-400 dark:via-blue-300 dark:to-blue-400" />
                </motion.div>
              )}

              {/* Hover indicator */}
              <AnimatePresence>
                {hoveredItem && hoveredItem !== selectedItem && (
                  <motion.div
                    className="absolute rounded-md z-[-1]"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      ...(() => {
                        const el = navItemRefs.current.get(hoveredItem)
                        if (!el) return { width: 0, height: 0, left: 0, top: 0 }
                        const rect = el.getBoundingClientRect()
                        const parentRect = el.parentElement?.getBoundingClientRect() || { left: 0, top: 0 }
                        return {
                          width: rect.width,
                          height: rect.height,
                          left: rect.left - parentRect.left,
                          top: rect.top - parentRect.top,
                        }
                      })(),
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-neutral-100/50 dark:bg-neutral-800/30 rounded-md" />
                  </motion.div>
                )}
              </AnimatePresence>

              {mainNavItems.map((item) => {
                const isActive = selectedItem === item.href
                return (
                  <div
                    key={item.title}
                    ref={(el) => {
                      if (el) navItemRefs.current.set(item.href, el)
                    }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors z-10 relative",
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-100",
                      )}
                      onClick={() => handleNavItemClick(item.href)}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      prefetch
                    >
                      <motion.div animate={isActive ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 0.3 }}>
                        {item.icon && <item.icon className="h-4 w-4" />}
                      </motion.div>
                      <span>{item.title}</span>
                    </Link>
                  </div>
                )
              })}
            </div>
          </nav>

          <div className="ml-auto flex items-center space-x-2">
            <div className="relative flex items-center space-x-1">
              {/* Theme Toggle Button */}
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <motion.button
                      onClick={handleThemeToggle}
                      className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-transparent p-0 text-sm font-medium text-neutral-600 dark:text-neutral-400 ring-offset-background transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="sr-only">
                        {appearance === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                      </span>
                      {appearance === 'dark' ? (
                        <Sun className="size-5 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                      ) : (
                        <Moon className="size-5 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                      )}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700">
                    <p>{appearance === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Mejorar los botones de navegación derecha */}
              <div className="hidden lg:flex">
                {rightNavItems.map((item) => (
                  <TooltipProvider key={item.title} delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger>
                        {item.external ? (
                          <motion.a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-transparent p-0 text-sm font-medium text-neutral-600 dark:text-neutral-400 ring-offset-background transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="sr-only">{item.title}</span>
                            {item.icon && (
                              <Icon
                                iconNode={item.icon}
                                className="size-5 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                              />
                            )}
                          </motion.a>
                        ) : (
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                              href={item.href}
                              className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-transparent p-0 text-sm font-medium text-neutral-600 dark:text-neutral-400 ring-offset-background transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                            >
                              <span className="sr-only">{item.title}</span>
                              {item.icon && (
                                <Icon
                                  iconNode={item.icon}
                                  className="size-5 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                                />
                              )}
                            </Link>
                          </motion.div>
                        )}
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700">
                        <p>{item.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* Mejorar el botón del avatar */}
                <Button
                  variant="ghost"
                  className="size-10 rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                >
                  <Avatar className="size-8 overflow-hidden rounded-full border-2 border-neutral-200 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all">
                    <AvatarImage src={auth.user.avatar || "/placeholder.svg"} alt={auth.user.name} />
                    <AvatarFallback className="rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100">
                      {getInitials(auth.user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              {/* Mejorar el estilo del DropdownMenuContent */}
              <DropdownMenuContent
                className="w-56 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                align="end"
              >
                <UserMenuContent user={auth.user} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {breadcrumbs.length > 1 && (
        // Mejorar el estilo de las migas de pan
        <div className="flex w-full border-b border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-600 dark:text-neutral-400 md:max-w-7xl">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </div>
      )}
    </>
  )
}
