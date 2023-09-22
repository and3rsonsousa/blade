import { Link } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { LogInIcon } from "lucide-react";
import Blade from "~/components/structure/blade";
import { Button } from "~/components/ui/button";

export default function Index() {
  return (
    <div className="relative grid min-h-screen place-content-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        className="absolute left-1/2 top-1/3 z-0 h-[40vh] w-[80vh] -translate-x-1/2 rounded-full bg-primary opacity-50 blur-[200px]"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: "-50%" }}
        animate={{ opacity: 1, scale: 0.8, x: "-50%" }}
        transition={{ duration: 2 }}
        className="absolute left-1/2 top-2/3 z-0 h-[20vh] w-[40vh] -translate-x-1/2 rounded-full bg-primary blur-[80px]"
      ></motion.div>
      <div className="relative max-w-xs text-center">
        {/* <div className="inline-block bg-gradient-to-r from-teal-400 via-primary  via-[65%] to-rose-500 bg-clip-text text-5xl font-black text-transparent">
          BLADE
        </div> */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 2, ease: [0.215, 0.61, 0.355, 1.0] }}
          >
            <Blade className="z-10 mx-auto w-48" />
          </motion.div>

          <motion.div
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
