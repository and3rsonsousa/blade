import { Link, MetaFunction } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { LogInIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import Blade from "~/components/structure/blade";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => [
  {
    title: "ʙʟaᴅe",
  },
];

export default function Index() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mouseMove = (event: MouseEvent) => {
      ref.current?.animate(
        { left: event.clientX + "px", top: event.clientY + "px" },
        { fill: "forwards", duration: 50000 },
      );
    };
    window.addEventListener("mousemove", mouseMove);
  }, []);
  return (
    <div className="relative grid min-h-screen place-content-center overflow-hidden">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        className=" absolute left-1/2 top-1/2 z-0 aspect-square w-[30vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary opacity-50"
      ></motion.div>
      <div className="absolute inset-0 backdrop-blur-[100px]"></div>

      <div className="relative max-w-xs text-center">
        <AnimatePresence>
          <motion.div
            key="b1"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 2, ease: [0.215, 0.61, 0.355, 1.0] }}
          >
            <Blade className="z-10 mx-auto w-48" />
          </motion.div>

          <motion.div
            key="b2"
            className="z-10 my-8"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 2,
              ease: [0.215, 0.61, 0.355, 1.0],
              delay: 0.5,
            }}
          >
            Sistema de gestão de ações criado e mantido pela{" "}
            <a
              href="https://agenciacanivete.com.br"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              aɢêɴᴄɪa ᴄaɴɪᴠeᴛe.
            </a>
          </motion.div>
          <motion.div
            key="b3"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 2,
              ease: [0.215, 0.61, 0.355, 1.0],
              delay: 1,
            }}
            className="z-10"
          >
            <Button variant={"default"} asChild>
              <Link to="/dashboard">
                Acessar <LogInIcon size={24} className="-mr-1 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
