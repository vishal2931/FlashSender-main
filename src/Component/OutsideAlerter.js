import React , {useContext , useEffect,useRef} from "react";
import { Context } from "../context/context";

function useOutsideAlerter(ref) {
    const { setConnectDrop , setNetworkModal } = useContext(Context);
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
            setConnectDrop(false);
            setNetworkModal(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);
  }
  
  /**
   * Component that alerts if you click outside of it
   */
  export default function OutsideAlerter(props) {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);
  
    return <div ref={wrapperRef}>{props.children}</div>;
  }